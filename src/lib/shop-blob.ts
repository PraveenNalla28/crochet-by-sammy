import { del, list, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

function blobEnabled() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
  );
}

export async function readJsonRecord<T>(
  relativePath: string,
  fallback: T,
): Promise<T> {
  if (blobEnabled()) {
    try {
      const { blobs } = await list({ prefix: relativePath, limit: 20 });
      const match = blobs.find(
        (item) =>
          item.pathname === relativePath ||
          item.pathname.endsWith(`/${relativePath}`),
      );
      if (match) {
        const res = await fetch(match.url, { cache: "no-store" });
        if (res.ok) return (await res.json()) as T;
      }
    } catch {
      // Fall through to the files bundled with the deploy.
    }
  }
  try {
    const raw = await readFile(
      path.join(process.cwd(), relativePath),
      "utf8",
    );
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonRecord(
  relativePath: string,
  value: unknown,
): Promise<void> {
  const body = JSON.stringify(value, null, 2);
  if (blobEnabled()) {
    await put(relativePath, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  const fullPath = path.join(process.cwd(), relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, body, "utf8");
}

export async function savePublicImage(
  pathname: string,
  bytes: Buffer,
): Promise<string> {
  if (blobEnabled()) {
    const blob = await put(pathname, bytes, {
      access: "public",
      addRandomSuffix: false,
      contentType: "image/jpeg",
    });
    return blob.url;
  }
  const fullPath = path.join(process.cwd(), "public", pathname);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, bytes);
  return `/${pathname.replace(/\\/g, "/")}`;
}

export async function deletePublicImage(src: string | undefined) {
  if (!src) return;
  if (src.includes("blob.vercel-storage.com")) {
    await del(src).catch(() => undefined);
    return;
  }
  if (!src.startsWith("/uploads/")) return;
  const fullPath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  const { unlink } = await import("fs/promises");
  await unlink(fullPath).catch(() => undefined);
}
