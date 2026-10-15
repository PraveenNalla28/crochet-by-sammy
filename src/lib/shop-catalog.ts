import { TAB_ROWS } from "@/data/products";
import { MAIN_NAV, type NavDropdownItem, type NavEntry } from "@/lib/navigation";
import { sectionHref } from "@/lib/shop-paths";
import type { ShopTab } from "@/lib/tabs";
import { tabFromPath } from "@/lib/tabs";

export const SHOP_CATALOG_TABS: ShopTab[] = [
  "women",
  "kids",
  "essentials",
  "gifts",
  "miniatures",
  "event-based",
];

export type CatalogProductEdit = {
  name?: string;
  pricePaise?: number;
  hidden?: boolean;
  imageUrl?: string;
  subtitle?: string;
};

export type CatalogExtraProduct = {
  slug: string;
  name: string;
  pricePaise: number;
  imageUrl: string;
  rowCategory: string;
  tab: ShopTab;
  subtitle?: string;
  inStock: boolean;
};

export type CatalogNavEdit = {
  label?: string;
  enabled?: boolean;
};

export type CatalogExtraNav = {
  tab: ShopTab;
  id: string;
  label: string;
  enabled: boolean;
};

export type CatalogState = {
  productEdits: Record<string, CatalogProductEdit>;
  extraProducts: CatalogExtraProduct[];
  navEdits: Record<string, CatalogNavEdit>;
  extraNav: CatalogExtraNav[];
};

export const EMPTY_CATALOG: CatalogState = {
  productEdits: {},
  extraProducts: [],
  navEdits: {},
  extraNav: [],
};

export function navKey(tab: ShopTab, id: string) {
  return `${tab}:${id}`;
}

export function slugifyLabel(label: string) {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "item";
}

export function rupeesInputToPaise(value: string) {
  const n = Number(String(value).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

export function paiseToRupeesInput(paise: number) {
  return String(Math.round(paise / 100));
}

export function isShopCatalogTab(value: string): value is ShopTab {
  return SHOP_CATALOG_TABS.includes(value as ShopTab);
}

export type CatalogNavOption = {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  extra: boolean;
};

export function navOptionsForTab(
  tab: ShopTab,
  catalog: CatalogState,
  showDisabled = false,
): CatalogNavOption[] {
  const base = TAB_ROWS[tab].map((row) => {
    const edit = catalog.navEdits[navKey(tab, row.rowCategory)];
    return {
      id: row.rowCategory,
      label: edit?.label?.trim() || row.label,
      href: sectionHref(tab, row.rowCategory),
      enabled: edit?.enabled !== false,
      extra: false,
    };
  });
  const extras = catalog.extraNav
    .filter((item) => item.tab === tab)
    .map((item) => ({
      id: item.id,
      label: item.label,
      href: sectionHref(tab, item.id),
      enabled: item.enabled !== false,
      extra: true,
    }));
  return [...base, ...extras].filter((item) => item.enabled || showDisabled);
}

export function buildMainNav(
  catalog: CatalogState,
  showDisabled = false,
): NavEntry[] {
  return MAIN_NAV.map((entry) => {
    if (entry.type !== "dropdown" || entry.href === "/about") return entry;
    const tab = tabFromPath(entry.href);
    if (tab === "home") return entry;
    const items: NavDropdownItem[] = navOptionsForTab(
      tab,
      catalog,
      showDisabled,
    ).map((item) => ({
      label: item.label,
      href: item.href,
      id: item.id,
      enabled: item.enabled,
      extra: item.extra,
      tab,
    }));
    return { ...entry, tab, items };
  });
}

export function applyProductEdit<T extends { slug: string; name: string; pricePaise: number; imageUrl: string }>(
  product: T,
  catalog: CatalogState,
  options?: { includeHidden?: boolean },
): T | null {
  const edit = catalog.productEdits[product.slug];
  if (edit?.hidden && !options?.includeHidden) return null;
  if (!edit) return product;
  return {
    ...product,
    name: edit.name?.trim() || product.name,
    pricePaise:
      typeof edit.pricePaise === "number" ? edit.pricePaise : product.pricePaise,
    imageUrl: edit.imageUrl || product.imageUrl,
    ...("subtitle" in product
      ? { subtitle: edit.subtitle ?? (product as T & { subtitle?: string }).subtitle }
      : {}),
  };
}

export function extraProductsForTab(
  tab: ShopTab,
  catalog: CatalogState,
  includeHidden = false,
) {
  return catalog.extraProducts.filter(
    (item) =>
      item.tab === tab &&
      (includeHidden || !catalog.productEdits[item.slug]?.hidden),
  );
}
