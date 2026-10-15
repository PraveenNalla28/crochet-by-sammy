import { NextResponse } from "next/server";
import {
  readHomeMedia,
  readShopSettings,
  saveShopSettings,
  saveSlotImage,
  saveSlotTransform,
} from "@/lib/shop-media-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [media, settings] = await Promise.all([
    readHomeMedia(),
    readShopSettings(),
  ]);
  return NextResponse.json(
    { media, settings },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const form = await request.formData();
  const slot = String(form.get("slot") ?? "").trim();
  const file = form.get("file");
  if (!slot || !(file instanceof File) || file.size < 1) {
    return NextResponse.json({ error: "Missing photo." }, { status: 400 });
  }
  if (file.size > 8_000_000) {
    return NextResponse.json({ error: "That photo is too large." }, { status: 400 });
  }
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const media = await saveSlotImage(slot, bytes);
    return NextResponse.json({ media });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not save that photo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    slot?: string;
    x?: number;
    y?: number;
    scale?: number;
    heroTextColor?: string;
  };
  if (typeof body.heroTextColor === "string") {
    const settings = await saveShopSettings({
      heroTextColor: body.heroTextColor,
    });
    return NextResponse.json({ settings });
  }
  const slot = String(body.slot ?? "").trim();
  if (!slot) {
    return NextResponse.json({ error: "Missing photo." }, { status: 400 });
  }
  const media = await saveSlotTransform(slot, {
    x: body.x,
    y: body.y,
    scale: body.scale,
  });
  return NextResponse.json({ media });
}
