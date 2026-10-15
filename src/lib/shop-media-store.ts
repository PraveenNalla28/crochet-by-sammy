import type { SlotMedia } from "@/lib/admin-media";
import {
  deletePublicImage,
  readJsonRecord,
  savePublicImage,
  writeJsonRecord,
} from "@/lib/shop-blob";

const MEDIA_PATH = "data/home-media.json";
const SETTINGS_PATH = "data/home-settings.json";

export type ShopSettings = {
  heroTextColor: string;
};

export const DEFAULT_SETTINGS: ShopSettings = {
  heroTextColor: "#2f2426",
};

function safeSlot(slot: string): string {
  return (
    slot.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) ||
    "photo"
  );
}

function asMedia(parsed: Record<string, unknown>): Record<string, SlotMedia> {
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
}

export async function readHomeMedia(): Promise<Record<string, SlotMedia>> {
  const parsed = await readJsonRecord<Record<string, unknown>>(MEDIA_PATH, {});
  if (!parsed || typeof parsed !== "object") return {};
  return asMedia(parsed);
}

async function writeHomeMedia(media: Record<string, SlotMedia>): Promise<void> {
  await writeJsonRecord(MEDIA_PATH, media);
}

export async function saveSlotImage(
  slot: string,
  bytes: Buffer,
): Promise<Record<string, SlotMedia>> {
  const name = `uploads/${safeSlot(slot)}-${Date.now()}.jpg`;
  const src = await savePublicImage(name, bytes);
  const media = await readHomeMedia();
  const previous = media[slot]?.src;
  media[slot] = { src, x: 0, y: 0, scale: 1 };
  await writeHomeMedia(media);
  await deletePublicImage(previous);
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
  const parsed = await readJsonRecord<Partial<ShopSettings>>(
    SETTINGS_PATH,
    DEFAULT_SETTINGS,
  );
  const color =
    typeof parsed.heroTextColor === "string" &&
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(parsed.heroTextColor)
      ? parsed.heroTextColor
      : DEFAULT_SETTINGS.heroTextColor;
  return { heroTextColor: color };
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
  await writeJsonRecord(SETTINGS_PATH, settings);
  return settings;
}
