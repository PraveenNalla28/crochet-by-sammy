import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import type { SlotMedia } from "@/lib/admin-media";

const DATA_PATH = path.join(process.cwd(), "data", "home-media.json");
const SETTINGS_PATH = path.join(process.cwd(), "data", "home-settings.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export type ShopSettings = {
  heroTextColor: string;
};

export const DEFAULT_SETTINGS: ShopSettings = {
  heroTextColor: "#2f2426",
};

function safeSlot(slot: string): string {
  return slot.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "photo";
}

export async function readHomeMedia(): Promise<Record<string, SlotMedia>> {
  try {
    const raw = await readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return {};
    const next: Record<string, SlotMedia> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!value || typeof value !== "object" || !("src" in value)) continue;
      const v = value as Partial<SlotMedia>;
      if (typeof v.src !== "string" || !v.src) continue;
      next[key] = {
        src: v.src,
        x: typeof v.x === "number" ? v.x : 0,
        y: typeof v.y === "number" ? v.y : 0,
        scale: typeof v.scale === "number" ? v.scale : 1,
      };
    }
    return next;
  } catch {
    return {};
  }
}

async function writeHomeMedia(media: Record<string, SlotMedia>): Promise<void> {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(media, null, 2), "utf8");
}

export async function saveSlotImage(
  slot: string,
  bytes: Buffer,
): Promise<Record<string, SlotMedia>> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${safeSlot(slot)}-${Date.now()}.jpg`;
  const filePath = path.join(UPLOAD_DIR, name);
  await writeFile(filePath, bytes);

  const media = await readHomeMedia();
  const previous = media[slot]?.src;
  media[slot] = { src: `/uploads/${name}`, x: 0, y: 0, scale: 1 };
  await writeHomeMedia(media);

  if (previous?.startsWith("/uploads/")) {
    const oldPath = path.join(process.cwd(), "public", previous.replace(/^\//, ""));
    if (oldPath.startsWith(UPLOAD_DIR)) {
      await unlink(oldPath).catch(() => undefined);
    }
  }

  return media;
}

export async function saveSlotTransform(
  slot: string,
  next: Partial<Pick<SlotMedia, "x" | "y" | "scale">>,
): Promise<Record<string, SlotMedia>> {
  const media = await readHomeMedia();
  const current = media[slot];
  if (!current) return media;
  media[slot] = {
    src: current.src,
    x: typeof next.x === "number" ? next.x : current.x,
    y: typeof next.y === "number" ? next.y : current.y,
    scale: typeof next.scale === "number" ? next.scale : current.scale,
  };
  await writeHomeMedia(media);
  return media;
}

export async function readShopSettings(): Promise<ShopSettings> {
  try {
    const raw = await readFile(SETTINGS_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<ShopSettings>;
    const color =
      typeof parsed.heroTextColor === "string" &&
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(parsed.heroTextColor)
        ? parsed.heroTextColor
        : DEFAULT_SETTINGS.heroTextColor;
    return { heroTextColor: color };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveShopSettings(
  next: Partial<ShopSettings>,
): Promise<ShopSettings> {
  const current = await readShopSettings();
  const color =
    typeof next.heroTextColor === "string" &&
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(next.heroTextColor)
      ? next.heroTextColor
      : current.heroTextColor;
  const settings = { heroTextColor: color };
  await mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
  await writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf8");
  return settings;
}
