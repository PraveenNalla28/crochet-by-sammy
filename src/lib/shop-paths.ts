import type { ShopTab } from "@/lib/tabs";

const TAB_PATH: Record<ShopTab, string> = {
  home: "/",
  women: "/women",
  kids: "/kids",
  essentials: "/essentials",
  gifts: "/gifts",
  miniatures: "/miniatures",
  "event-based": "/event-based",
};

export function sectionHref(tab: ShopTab, rowCategory: string): string {
  return `${TAB_PATH[tab]}/${rowCategory}`;
}

export function collectionSubFromPath(
  pathname: string,
  subcategories: readonly { id: string }[],
) {
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  if (!last || parts.length < 2) return null;
  return subcategories.some((item) => item.id === last) ? last : null;
}

export function collectionRootFromPath(pathname: string, selectedSub: string | null) {
  if (!selectedSub) return pathname || "/";
  const suffix = `/${selectedSub}`;
  return pathname.endsWith(suffix)
    ? pathname.slice(0, -suffix.length) || "/"
    : pathname;
}
