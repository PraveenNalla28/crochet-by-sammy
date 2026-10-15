import { FESTIVE_PRODUCTS } from "@/data/festive-collection";
import { GIFTS_PRODUCTS } from "@/data/gifts-collection";
import { HOME_DECOR_PRODUCTS } from "@/data/home-decor-collection";
import { KIDS_PRODUCTS } from "@/data/kids-collection";
import { MINIATURES_PRODUCTS } from "@/data/miniatures-collection";
import {
  PRODUCTS,
  TAB_ROWS,
  type Product,
} from "@/data/products";
import { WOMEN_PRODUCTS } from "@/data/womens-accessories";
import {
  applyProductEdit,
  EMPTY_CATALOG,
  navKey,
  type CatalogState,
} from "@/lib/shop-catalog";
import type { ShopTab } from "@/lib/tabs";

const CATEGORY_META: Record<
  ShopTab,
  { label: string; href: string }
> = {
  home: { label: "Shop", href: "/" },
  women: { label: "Women's Accessories", href: "/women" },
  kids: { label: "Kids' Collection", href: "/kids" },
  essentials: { label: "Home & Car Décor", href: "/essentials" },
  gifts: { label: "Gifts & Keychains", href: "/gifts" },
  miniatures: { label: "Personalized Miniatures", href: "/miniatures" },
  "event-based": { label: "Festive & Devotional", href: "/event-based" },
};

const CATALOGS = [
  WOMEN_PRODUCTS,
  KIDS_PRODUCTS,
  HOME_DECOR_PRODUCTS,
  GIFTS_PRODUCTS,
  MINIATURES_PRODUCTS,
  FESTIVE_PRODUCTS,
] as const;

function uniqueUrls(urls: string[]) {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const url of urls) {
    if (!url || seen.has(url)) continue;
    seen.add(url);
    next.push(url);
  }
  return next;
}

export function getCatalogExtras(slug: string) {
  for (const list of CATALOGS) {
    const found = list.find((item) => item.slug === slug);
    if (found) {
      return {
        subtitle: "subtitle" in found ? found.subtitle : undefined,
        inStock: "inStock" in found ? found.inStock : true,
      };
    }
  }
  return { subtitle: undefined, inStock: true };
}

function catalogProducts(catalog: CatalogState): Product[] {
  const extras: Product[] = catalog.extraProducts.map((item) => ({
    slug: item.slug,
    name: item.name,
    pricePaise: item.pricePaise,
    imageUrl: item.imageUrl,
    tab: item.tab,
    rowCategory: item.rowCategory,
  }));
  const seen = new Set<string>();
  const next: Product[] = [];
  for (const item of [...PRODUCTS, ...extras]) {
    if (seen.has(item.slug)) continue;
    const edited = applyProductEdit(item, catalog);
    if (!edited) continue;
    seen.add(item.slug);
    next.push(edited);
  }
  return next;
}

export function getProductGallery(
  product: Product,
  catalog: CatalogState = EMPTY_CATALOG,
): string[] {
  const all = catalogProducts(catalog);
  const sameCategory = all
    .filter(
      (item) =>
        item.tab === product.tab && item.rowCategory === product.rowCategory,
    )
    .map((item) => item.imageUrl);
  const sameTab = all
    .filter((item) => item.tab === product.tab)
    .map((item) => item.imageUrl);
  return uniqueUrls([product.imageUrl, ...sameCategory, ...sameTab]).slice(0, 8);
}

export function getRelatedProducts(
  product: Product,
  catalog: CatalogState = EMPTY_CATALOG,
  limit = 4,
): Product[] {
  const all = catalogProducts(catalog);
  const seen = new Set<string>([product.slug]);
  const next: Product[] = [];
  const pools = [
    all.filter(
      (item) =>
        item.tab === product.tab && item.rowCategory === product.rowCategory,
    ),
    all.filter((item) => item.tab === product.tab),
  ];
  for (const pool of pools) {
    for (const item of pool) {
      if (seen.has(item.slug)) continue;
      seen.add(item.slug);
      next.push(item);
      if (next.length >= limit) return next;
    }
  }
  return next;
}

export function getSubcategoryLabel(
  tab: ShopTab,
  rowCategory: string,
  catalog: CatalogState = EMPTY_CATALOG,
) {
  const extra = catalog.extraNav.find(
    (item) => item.tab === tab && item.id === rowCategory,
  );
  if (extra?.label) return extra.label;
  const edit = catalog.navEdits[navKey(tab, rowCategory)];
  if (edit?.label) return edit.label;
  return (
    TAB_ROWS[tab].find((row) => row.rowCategory === rowCategory)?.label ??
    rowCategory
  );
}

export function getProductDetail(
  slug: string,
  catalog: CatalogState = EMPTY_CATALOG,
) {
  const extra = catalog.extraProducts.find((item) => item.slug === slug);
  const builtIn = PRODUCTS.find((item) => item.slug === slug);
  if (!extra && !builtIn) return null;
  const product = applyProductEdit(
    extra
      ? {
          slug: extra.slug,
          name: extra.name,
          pricePaise: extra.pricePaise,
          imageUrl: extra.imageUrl,
          tab: extra.tab,
          rowCategory: extra.rowCategory,
        }
      : builtIn!,
    catalog,
  );
  if (!product) return null;
  const extras = extra
    ? { subtitle: extra.subtitle, inStock: extra.inStock }
    : getCatalogExtras(slug);
  const category = CATEGORY_META[product.tab];
  const subcategory = getSubcategoryLabel(
    product.tab,
    product.rowCategory,
    catalog,
  );
  const images = getProductGallery(product, catalog);
  const related = getRelatedProducts(product, catalog);
  const description = extras.subtitle
    ? `${extras.subtitle}. Handmade with love by crochet_by_sammu — a one-of-a-kind piece from our ${category.label} collection.`
    : `Handmade with love by crochet_by_sammu. This piece is part of our ${category.label} collection, crafted to be kept, gifted and cherished.`;
  return {
    ...product,
    ...extras,
    images,
    related,
    category,
    subcategory,
    description,
  };
}
