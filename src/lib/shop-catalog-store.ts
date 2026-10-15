import { readJsonRecord, writeJsonRecord } from "@/lib/shop-blob";
import {
  EMPTY_CATALOG,
  isShopCatalogTab,
  type CatalogExtraNav,
  type CatalogExtraProduct,
  type CatalogNavEdit,
  type CatalogProductEdit,
  type CatalogState,
} from "@/lib/shop-catalog";

const DATA_PATH = "data/shop-catalog.json";

function asString(value: unknown, max = 120) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function asPrice(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.round(value))
    : null;
}

function sanitizeProductEdit(value: unknown): CatalogProductEdit | null {
  if (!value || typeof value !== "object") return null;
  const v = value as CatalogProductEdit;
  const next: CatalogProductEdit = {};
  const name = asString(v.name, 80);
  if (name) next.name = name;
  const price = asPrice(v.pricePaise);
  if (price !== null) next.pricePaise = price;
  if (typeof v.hidden === "boolean") next.hidden = v.hidden;
  const imageUrl = asString(v.imageUrl, 400);
  if (imageUrl && !imageUrl.startsWith("data:")) next.imageUrl = imageUrl;
  const subtitle = asString(v.subtitle, 80);
  if (subtitle) next.subtitle = subtitle;
  return Object.keys(next).length ? next : null;
}

function sanitizeExtraProduct(value: unknown): CatalogExtraProduct | null {
  if (!value || typeof value !== "object") return null;
  const v = value as CatalogExtraProduct;
  const slug = asString(v.slug, 80).replace(/[^a-z0-9-]/g, "");
  const name = asString(v.name, 80);
  const tab = asString(v.tab, 20);
  const rowCategory = asString(v.rowCategory, 60).replace(/[^a-z0-9-]/g, "");
  const price = asPrice(v.pricePaise) ?? 0;
  const imageUrl = asString(v.imageUrl, 400);
  if (!slug || !name || !rowCategory || !isShopCatalogTab(tab)) return null;
  if (imageUrl.startsWith("data:")) return null;
  return {
    slug,
    name,
    pricePaise: price,
    imageUrl: imageUrl || "/images/categories/cat-1.png",
    rowCategory,
    tab,
    subtitle: asString(v.subtitle, 80) || undefined,
    inStock: v.inStock !== false,
  };
}

function sanitizeNavEdit(value: unknown): CatalogNavEdit | null {
  if (!value || typeof value !== "object") return null;
  const v = value as CatalogNavEdit;
  const next: CatalogNavEdit = {};
  const label = asString(v.label, 40);
  if (label) next.label = label;
  if (typeof v.enabled === "boolean") next.enabled = v.enabled;
  return Object.keys(next).length ? next : null;
}

function sanitizeExtraNav(value: unknown): CatalogExtraNav | null {
  if (!value || typeof value !== "object") return null;
  const v = value as CatalogExtraNav;
  const tab = asString(v.tab, 20);
  const id = asString(v.id, 60).replace(/[^a-z0-9-]/g, "");
  const label = asString(v.label, 40);
  if (!id || !label || !isShopCatalogTab(tab)) return null;
  return { tab, id, label, enabled: v.enabled !== false };
}

export function sanitizeCatalog(input: unknown): CatalogState {
  const raw = input && typeof input === "object" ? (input as CatalogState) : EMPTY_CATALOG;
  const productEdits: Record<string, CatalogProductEdit> = {};
  for (const [slug, edit] of Object.entries(raw.productEdits ?? {})) {
    const clean = sanitizeProductEdit(edit);
    if (clean) productEdits[slug.slice(0, 80)] = clean;
  }
  const extraProducts = (raw.extraProducts ?? [])
    .map(sanitizeExtraProduct)
    .filter((item): item is CatalogExtraProduct => Boolean(item))
    .slice(0, 200);
  const navEdits: Record<string, CatalogNavEdit> = {};
  for (const [key, edit] of Object.entries(raw.navEdits ?? {})) {
    const clean = sanitizeNavEdit(edit);
    if (clean) navEdits[key.slice(0, 80)] = clean;
  }
  const extraNav = (raw.extraNav ?? [])
    .map(sanitizeExtraNav)
    .filter((item): item is CatalogExtraNav => Boolean(item))
    .slice(0, 80);
  return { productEdits, extraProducts, navEdits, extraNav };
}

export async function readShopCatalog(): Promise<CatalogState> {
  const raw = await readJsonRecord<unknown>(DATA_PATH, EMPTY_CATALOG);
  return sanitizeCatalog(raw);
}

export async function saveShopCatalog(input: unknown): Promise<CatalogState> {
  const catalog = sanitizeCatalog(input);
  await writeJsonRecord(DATA_PATH, catalog);
  return catalog;
}
