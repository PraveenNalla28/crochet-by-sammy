export type ShopMode = "admin" | "viewer";

export type SlotMedia = {
  src: string;
  x: number;
  y: number;
  scale: number;
};

const MEDIA_KEY = "crochet-sammu-home-media-v2";
const LEGACY_KEY = "crochet-sammu-home-media-v1";
const MODE_KEY = "crochet-sammu-shop-mode-v1";

export const DEFAULT_TRANSFORM = { x: 0, y: 0, scale: 1 };

export const DEFAULT_HERO_TEXT_COLOR = "#2f2426";

const SETTINGS_KEY = "crochet-sammu-shop-settings-v1";

export function loadHeroTextColor(): string {
  if (typeof window === "undefined") return DEFAULT_HERO_TEXT_COLOR;
  const value = window.localStorage.getItem(SETTINGS_KEY);
  return value && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
    ? value
    : DEFAULT_HERO_TEXT_COLOR;
}

export function saveHeroTextColor(color: string): void {
  try {
    window.localStorage.setItem(SETTINGS_KEY, color);
  } catch {
    // ignore quota
  }
}

export function loadShopMode(): ShopMode {
  if (typeof window === "undefined") return "admin";
  return window.localStorage.getItem(MODE_KEY) === "viewer" ? "viewer" : "admin";
}

export function saveShopMode(mode: ShopMode): void {
  window.localStorage.setItem(MODE_KEY, mode);
}

function asSlotMedia(value: unknown): SlotMedia | null {
  if (typeof value === "string" && value) {
    return { src: value, ...DEFAULT_TRANSFORM };
  }
  if (value && typeof value === "object" && "src" in value) {
    const v = value as Partial<SlotMedia>;
    if (typeof v.src !== "string" || !v.src) return null;
    return {
      src: v.src,
      x: typeof v.x === "number" ? v.x : 0,
      y: typeof v.y === "number" ? v.y : 0,
      scale: typeof v.scale === "number" ? v.scale : 1,
    };
  }
  return null;
}

export function loadHomeMedia(): Record<string, SlotMedia> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(MEDIA_KEY);
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    const parsed = raw
      ? (JSON.parse(raw) as Record<string, unknown>)
      : legacy
        ? (JSON.parse(legacy) as Record<string, unknown>)
        : {};
    if (!parsed || typeof parsed !== "object") return {};
    const next: Record<string, SlotMedia> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const media = asSlotMedia(value);
      if (media) next[key] = media;
    }
    return next;
  } catch {
    return {};
  }
}

export function saveHomeMedia(media: Record<string, SlotMedia>): void {
  try {
    const slim: Record<string, SlotMedia> = {};
    for (const [key, value] of Object.entries(media)) {
      if (!value.src.startsWith("data:")) slim[key] = value;
    }
    window.localStorage.setItem(MEDIA_KEY, JSON.stringify(slim));
  } catch {
    // Browser storage is full; server copy is the source of truth.
  }
}

export function clampScale(scale: number): number {
  return Math.min(3, Math.max(1, scale));
}

export function clampPan(n: number, scale: number): number {
  const max = 50 * (scale - 1) + 8;
  return Math.min(max, Math.max(-max, n));
}

export function compressImageFile(
  file: File,
  maxEdge = 1600,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process that photo."));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("That file is not a usable image."));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
