"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clampPan,
  clampScale,
  compressImageFile,
  DEFAULT_HERO_TEXT_COLOR,
  DEFAULT_TRANSFORM,
  loadShopMode,
  saveHeroTextColor,
  saveHomeMedia,
  saveShopMode,
  type ShopMode,
  type SlotMedia,
} from "@/lib/admin-media";

type AdminMediaContextValue = {
  ready: boolean;
  mode: ShopMode;
  isAdmin: boolean;
  heroTextColor: string;
  mediaFor: (slot: string, fallback: string) => SlotMedia;
  setMode: (mode: ShopMode) => void;
  setHeroTextColor: (color: string) => void;
  replaceSlot: (slot: string, file: File) => Promise<string>;
  updateTransform: (
    slot: string,
    fallback: string,
    next: Partial<Pick<SlotMedia, "x" | "y" | "scale">>,
  ) => void;
};

const AdminMediaContext = createContext<AdminMediaContextValue | null>(null);

async function fetchSavedShop(): Promise<{
  media: Record<string, SlotMedia>;
  settings: { heroTextColor: string };
}> {
  const res = await fetch(`/api/shop-media?t=${Date.now()}`, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
  if (!res.ok) throw new Error("Could not load saved photos.");
  const data = (await res.json()) as {
    media?: Record<string, SlotMedia>;
    settings?: { heroTextColor?: string };
    hero?: SlotMedia;
  };
  const media =
    data.media && typeof data.media === "object"
      ? data.media
      : data.hero
        ? (data as unknown as Record<string, SlotMedia>)
        : {};
  return {
    media,
    settings: {
      heroTextColor: data.settings?.heroTextColor ?? DEFAULT_HERO_TEXT_COLOR,
    },
  };
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function AdminMediaProvider({
  children,
  initialMedia = {},
  initialSettings,
}: {
  children: ReactNode;
  initialMedia?: Record<string, SlotMedia>;
  initialSettings?: { heroTextColor: string };
}) {
  const [mode, setModeState] = useState<ShopMode>("viewer");
  const [media, setMedia] = useState<Record<string, SlotMedia>>(initialMedia);
  const [heroTextColor, setHeroTextColorState] = useState(
    initialSettings?.heroTextColor ?? DEFAULT_HERO_TEXT_COLOR,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setModeState(loadShopMode());
    fetchSavedShop()
      .then(({ media: saved, settings }) => {
        if (Object.keys(saved).length) {
          setMedia(saved);
          saveHomeMedia(saved);
        }
        if (settings.heroTextColor) {
          setHeroTextColorState(settings.heroTextColor);
          saveHeroTextColor(settings.heroTextColor);
        }
      })
      .catch(() => {
        // Keep the photos sent from the server. Do not fall back to
        // this phone's old local copies.
      })
      .finally(() => setReady(true));
  }, []);

  const setMode = useCallback((next: ShopMode) => {
    setModeState(next);
    saveShopMode(next);
  }, []);

  const persistLocal = useCallback((next: Record<string, SlotMedia>) => {
    saveHomeMedia(next);
    setMedia(next);
  }, []);

  const replaceSlot = useCallback(
    async (slot: string, file: File) => {
      const dataUrl = await compressImageFile(file, 1400, 0.78);
      persistLocal({
        ...media,
        [slot]: { src: dataUrl, ...DEFAULT_TRANSFORM },
      });
      const body = new FormData();
      body.append("slot", slot);
      body.append("file", dataUrlToBlob(dataUrl), `${slot}.jpg`);
      const res = await fetch("/api/shop-media", { method: "POST", body });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error || "Could not save that photo. Please try again.",
        );
      }
      const saved = (await res.json()) as { media?: Record<string, SlotMedia> };
      persistLocal(saved.media ?? {});
      return saved.media?.[slot]?.src ?? dataUrl;
    },
    [media, persistLocal],
  );

  const mediaFor = useCallback(
    (slot: string, fallback: string): SlotMedia => {
      return media[slot] ?? { src: fallback, ...DEFAULT_TRANSFORM };
    },
    [media],
  );

  const updateTransform = useCallback(
    (
      slot: string,
      fallback: string,
      next: Partial<Pick<SlotMedia, "x" | "y" | "scale">>,
    ) => {
      const current = media[slot] ?? {
        src: fallback,
        ...DEFAULT_TRANSFORM,
      };
      const scale = clampScale(next.scale ?? current.scale);
      const updated = {
        ...media,
        [slot]: {
          src: current.src,
          scale,
          x: clampPan(next.x ?? current.x, scale),
          y: clampPan(next.y ?? current.y, scale),
        },
      };
      persistLocal(updated);
      void fetch("/api/shop-media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot,
          x: updated[slot].x,
          y: updated[slot].y,
          scale: updated[slot].scale,
        }),
      }).catch(() => undefined);
    },
    [media, persistLocal],
  );

  const setHeroTextColor = useCallback((color: string) => {
    setHeroTextColorState(color);
    saveHeroTextColor(color);
    void fetch("/api/shop-media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroTextColor: color }),
    }).catch(() => undefined);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      mode,
      isAdmin: ready && mode === "admin",
      heroTextColor,
      mediaFor,
      setMode,
      setHeroTextColor,
      replaceSlot,
      updateTransform,
    }),
    [
      ready,
      mode,
      heroTextColor,
      mediaFor,
      setMode,
      setHeroTextColor,
      replaceSlot,
      updateTransform,
    ],
  );

  return (
    <AdminMediaContext.Provider value={value}>
      {children}
    </AdminMediaContext.Provider>
  );
}

export function useAdminMedia() {
  const ctx = useContext(AdminMediaContext);
  if (!ctx) {
    throw new Error("useAdminMedia must be used inside AdminMediaProvider");
  }
  return ctx;
}
