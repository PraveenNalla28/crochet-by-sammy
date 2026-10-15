"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AddProductPanel,
  CatalogProductEditor,
} from "@/components/admin/admin-catalog-controls";
import { EditablePhoto } from "@/components/admin/editable-photo";
import { useAdminMedia } from "@/components/admin/admin-media-context";
import { useShopCatalog } from "@/components/admin/shop-catalog-context";
import { InstagramStrip } from "@/components/home/instagram-strip";
import { SectionHeading } from "@/components/home/section-heading";
import { IconHeart } from "@/components/icons";
import { formatINR } from "@/lib/money";
import {
  applyProductEdit,
  extraProductsForTab,
  navOptionsForTab,
} from "@/lib/shop-catalog";
import {
  collectionRootFromPath,
  collectionSubFromPath,
} from "@/lib/shop-paths";
import type { ShopTab } from "@/lib/tabs";

export const COLLECTION_PRICE_RANGES = [
  { id: "under-500", label: "Under ₹500", min: 0, max: 49900 },
  { id: "500-1000", label: "₹500 – ₹1,000", min: 50000, max: 100000 },
  { id: "1000-1500", label: "₹1,000 – ₹1,500", min: 100000, max: 150000 },
  { id: "above-1500", label: "Above ₹1,500", min: 150100, max: Infinity },
] as const;

export type CollectionProduct = {
  slug: string;
  name: string;
  pricePaise: number;
  imageUrl: string;
  rowCategory: string;
  subtitle?: string;
  colors?: string[];
  occasions: string[];
  styles?: string[];
  inStock: boolean;
  extra?: boolean;
  hidden?: boolean;
};

export type CollectionPriceRange = {
  id: string;
  label: string;
  min: number;
  max: number;
};

export type CollectionConfig = {
  breadcrumb: string;
  eyebrow: string;
  title: string;
  description: string;
  features: readonly string[];
  subcategories: readonly { id: string; label: string }[];
  colors?: readonly { id: string; label: string; hex: string }[];
  priceRanges?: readonly CollectionPriceRange[];
  availabilityLabel?: string;
  extraFilterLabel: string;
  extraFilters: readonly { id: string; label: string }[];
  styleFilterLabel?: string;
  styleFilters?: readonly { id: string; label: string }[];
  cta?: { label: string; href: string };
  products: CollectionProduct[];
  alsoLike: readonly {
    name: string;
    pricePaise: number;
    slug: string;
    image: string;
  }[];
  why: readonly {
    title: string;
    text: string;
    icon: "heart" | "soft" | "gift" | "handmade" | "camera";
  }[];
  showInstagram?: boolean;
  tab: ShopTab;
};

type SortId = "featured" | "price-asc" | "price-desc" | "name";
type ViewMode = "grid" | "list";

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function countFor(
  products: CollectionProduct[],
  predicate: (product: CollectionProduct) => boolean,
) {
  return products.filter(predicate).length;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="#8b4a52" />
      <path
        d="M5 8.2l2 2 4-4.4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="2.5" y="2.5" width="6" height="6" rx="1" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
    </svg>
  );
}

function ColorSwatch({ hex, selected }: { hex: string; selected: boolean }) {
  if (hex === "multicolor") {
    return (
      <span
        className={`h-4 w-4 rounded-full border ${selected ? "ring-2 ring-[#8b4a52] ring-offset-1" : "border-[#d8c9c4]"}`}
        style={{
          background:
            "conic-gradient(#f3a6bc, #efd36a, #8fbf8f, #8bb8e8, #c9a6e0, #f3a6bc)",
        }}
      />
    );
  }
  return (
    <span
      className={`h-4 w-4 rounded-full border ${selected ? "ring-2 ring-[#8b4a52] ring-offset-1" : "border-[#d8c9c4]"}`}
      style={{ background: hex }}
    />
  );
}

function WhyIcon({ icon }: { icon: CollectionConfig["why"][number]["icon"] }) {
  if (icon === "soft") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path
          d="M4 12c4-6 12-6 16 0-4 6-12 6-16 0z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (icon === "handmade") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path
          d="M12 3l1.8 5.4H20l-4.6 3.4 1.8 5.5L12 14.8 6.8 17.3l1.8-5.5L4 8.4h6.2L12 3z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (icon === "camera") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path
          d="M4 8h4l2-2h4l2 2h4v11H4V8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (icon === "gift") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path
          d="M4 12h16v8H4zM4 8h16v4H4zM12 8v12M8 8c0-2 1.2-3.5 3-3.5S12 8 12 8s1-3.5 3-3.5 3 1.5 3 3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        d="M12 21s-7-4.5-9.5-9.5C1 8.5 3.5 6 6.5 6c1.7 0 3.2.9 4 2.2.8-1.3 2.3-2.2 4-2.2 3 0 5.5 2.5 4 5.5C19 16.5 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  );
}

function CollectionCard({
  product,
  layout,
}: {
  product: CollectionProduct;
  layout: ViewMode;
}) {
  const { isAdmin } = useAdminMedia();
  const image = (
    <div
      className={`relative overflow-hidden bg-[#fcecee] ${layout === "list" ? "h-28 w-28 shrink-0 rounded-xl" : "aspect-square"}`}
    >
      <EditablePhoto
        slot={`product-${product.slug}`}
        fallback={product.imageUrl}
        alt={product.name}
        sizes={layout === "list" ? "112px" : "(max-width: 768px) 50vw, 25vw"}
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <span className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#e08aa0] shadow-sm">
        <IconHeart className="h-4 w-4" />
      </span>
      {product.hidden ? (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-[#2f2426]/80 px-2 py-0.5 text-[10px] text-white">
          Hidden
        </span>
      ) : null}
    </div>
  );

  const copy = (
    <div className={layout === "list" ? "min-w-0 flex-1 py-1" : "px-3 pb-4 pt-3 text-center"}>
      <h2 className="font-serif text-[15px] text-[#2f2426] md:text-base">
        {product.name}
      </h2>
      {product.subtitle ? (
        <p className="mt-0.5 text-xs text-[#8a7a7d]">{product.subtitle}</p>
      ) : null}
      <p className="mt-1 text-sm font-medium text-[#c45b73]">
        {formatINR(product.pricePaise)}
      </p>
    </div>
  );

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#f0e0e3] bg-white shadow-[0_2px_10px_rgba(139,74,82,0.05)] ${
        product.hidden ? "opacity-70" : ""
      }`}
    >
      <Link
        href={`/product/${product.slug}`}
        className={`group ${layout === "list" ? "flex items-center gap-4 p-3" : "block"}`}
      >
        {image}
        {copy}
      </Link>
      {isAdmin ? <CatalogProductEditor product={product} extra={product.extra} /> : null}
    </div>
  );
}

function matchingSub(
  subcategories: readonly { id: string }[],
  value: string | null | undefined,
) {
  return value && subcategories.some((item) => item.id === value) ? value : null;
}

export function CategoryCollectionPage({
  config,
  initialSub,
}: {
  config: CollectionConfig;
  initialSub?: string;
}) {
  const pathname = usePathname();
  const { isAdmin } = useAdminMedia();
  const { catalog } = useShopCatalog();
  const subcategories = navOptionsForTab(config.tab, catalog, isAdmin).map(
    (item) => ({ id: item.id, label: item.label }),
  );
  const products = [
    ...config.products.flatMap((product) => {
      const next = applyProductEdit(product, catalog, { includeHidden: isAdmin });
      if (!next) return [];
      return [
        {
          ...next,
          hidden: catalog.productEdits[product.slug]?.hidden === true,
        },
      ];
    }),
    ...extraProductsForTab(config.tab, catalog, isAdmin).flatMap((product) => {
      const base: CollectionProduct = {
        slug: product.slug,
        name: product.name,
        pricePaise: product.pricePaise,
        imageUrl: product.imageUrl,
        rowCategory: product.rowCategory,
        subtitle: product.subtitle,
        occasions: [],
        inStock: product.inStock,
        extra: true,
      };
      const next = applyProductEdit(base, catalog, { includeHidden: isAdmin });
      if (!next) return [];
      return [
        {
          ...next,
          extra: true,
          hidden: catalog.productEdits[product.slug]?.hidden === true,
        },
      ];
    }),
  ];
  const resolved = { ...config, subcategories, products };
  const selectedSub =
    collectionSubFromPath(pathname, subcategories) ??
    matchingSub(subcategories, initialSub);
  return (
    <CategoryCollectionInner
      key={selectedSub ?? "all"}
      config={resolved}
      selectedSub={selectedSub}
      pathname={pathname}
    />
  );
}

function CategoryCollectionInner({
  config,
  selectedSub,
  pathname,
}: {
  config: CollectionConfig;
  selectedSub: string | null;
  pathname: string;
}) {
  const [subs, setSubs] = useState<string[]>(selectedSub ? [selectedSub] : []);
  const [prices, setPrices] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const priceRanges = config.priceRanges ?? COLLECTION_PRICE_RANGES;
  const availabilityLabel = config.availabilityLabel ?? "In Stock";
  const [sort, setSort] = useState<SortId>("featured");
  const [view, setView] = useState<ViewMode>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    if (selectedSub) {
      setSubs([selectedSub]);
      return;
    }
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      const match = matchingSub(config.subcategories, hash);
      if (match) setSubs([match]);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [config.subcategories, selectedSub]);

  const filtered = useMemo(() => {
    let next = config.products.filter((product) => {
      if (subs.length && !subs.includes(product.rowCategory)) return false;
      if (
        prices.length &&
        !prices.some((id) => {
          const range = priceRanges.find((item) => item.id === id);
          if (!range) return false;
          return product.pricePaise >= range.min && product.pricePaise <= range.max;
        })
      ) {
        return false;
      }
      if (
        colors.length &&
        !(product.colors ?? []).some((color) => colors.includes(color))
      ) {
        return false;
      }
      if (inStockOnly && !product.inStock) return false;
      if (extras.length && !product.occasions.some((item) => extras.includes(item))) {
        return false;
      }
      if (
        styles.length &&
        !(product.styles ?? []).some((item) => styles.includes(item))
      ) {
        return false;
      }
      return true;
    });

    if (sort === "price-asc") next = [...next].sort((a, b) => a.pricePaise - b.pricePaise);
    if (sort === "price-desc") next = [...next].sort((a, b) => b.pricePaise - a.pricePaise);
    if (sort === "name") next = [...next].sort((a, b) => a.name.localeCompare(b.name));
    return next;
  }, [config.products, priceRanges, subs, prices, colors, extras, styles, inStockOnly, sort]);

  const filters = (
    <div className="space-y-7 text-sm text-[#5a4a4d]">
      <p className="font-serif text-base text-[#2f2426]">Filter by</p>

      <fieldset>
        <legend className="mb-3 font-semibold text-[#2f2426]">Subcategories</legend>
        <ul className="space-y-2">
          {config.subcategories.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={subs.includes(item.id)}
                  onChange={() => setSubs(toggleValue(subs, item.id))}
                  className="h-3.5 w-3.5 accent-[#8b4a52]"
                />
                <span>
                  {item.label} (
                  {countFor(config.products, (p) => p.rowCategory === item.id)})
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-semibold text-[#2f2426]">Price Range</legend>
        <ul className="space-y-2">
          {priceRanges.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={prices.includes(item.id)}
                  onChange={() => setPrices(toggleValue(prices, item.id))}
                  className="h-3.5 w-3.5 accent-[#8b4a52]"
                />
                <span>
                  {item.label} (
                  {countFor(
                    config.products,
                    (p) => p.pricePaise >= item.min && p.pricePaise <= item.max,
                  )}
                  )
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {config.colors && config.colors.length > 0 ? (
        <fieldset>
          <legend className="mb-3 font-semibold text-[#2f2426]">Color</legend>
          <ul className="space-y-2">
            {config.colors.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={colors.includes(item.id)}
                    onChange={() => setColors(toggleValue(colors, item.id))}
                    className="h-3.5 w-3.5 accent-[#8b4a52]"
                  />
                  <ColorSwatch hex={item.hex} selected={colors.includes(item.id)} />
                  <span>
                    {item.label} (
                    {countFor(config.products, (p) =>
                      (p.colors ?? []).includes(item.id),
                    )}
                    )
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="mb-3 font-semibold text-[#2f2426]">Availability</legend>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly((v) => !v)}
            className="h-3.5 w-3.5 accent-[#8b4a52]"
          />
          <span>
            {availabilityLabel} ({countFor(config.products, (p) => p.inStock)})
          </span>
        </label>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-semibold text-[#2f2426]">
          {config.extraFilterLabel}
        </legend>
        <ul className="space-y-2">
          {config.extraFilters.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={extras.includes(item.id)}
                  onChange={() => setExtras(toggleValue(extras, item.id))}
                  className="h-3.5 w-3.5 accent-[#8b4a52]"
                />
                <span>
                  {item.label} (
                  {countFor(config.products, (p) => p.occasions.includes(item.id))})
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {config.styleFilters && config.styleFilters.length > 0 ? (
        <fieldset>
          <legend className="mb-3 font-semibold text-[#2f2426]">
            {config.styleFilterLabel ?? "Style / Use"}
          </legend>
          <ul className="space-y-2">
            {config.styleFilters.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={styles.includes(item.id)}
                    onChange={() => setStyles(toggleValue(styles, item.id))}
                    className="h-3.5 w-3.5 accent-[#8b4a52]"
                  />
                  <span>
                    {item.label} (
                    {countFor(config.products, (p) =>
                      (p.styles ?? []).includes(item.id),
                    )}
                    )
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}
    </div>
  );

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 md:px-8 md:pt-6">
        <nav className="mb-5 text-[13px] text-[#8a7a7d]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-[#8b4a52]">
                Home
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href="/women" className="hover:text-[#8b4a52]">
                Shop
              </Link>
            </li>
            <li aria-hidden>›</li>
            {selectedSub ? (
              <>
                <li>
                  <Link
                    href={collectionRootFromPath(pathname, selectedSub)}
                    className="hover:text-[#8b4a52]"
                  >
                    {config.breadcrumb}
                  </Link>
                </li>
                <li aria-hidden>›</li>
                <li className="font-medium text-[#8b4a52]">
                  {config.subcategories.find((item) => item.id === selectedSub)
                    ?.label ?? selectedSub}
                </li>
              </>
            ) : (
              <li className="font-medium text-[#8b4a52]">{config.breadcrumb}</li>
            )}
          </ol>
        </nav>

        <section className="max-w-2xl pb-1 pt-1">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#8b4a52]">
            {config.eyebrow}
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-[#2f2426] md:text-5xl">
            {config.subcategories.find((item) => item.id === selectedSub)
              ?.label ?? config.title}{" "}
            <span className="text-[#e08aa0]" aria-hidden>
              ♡
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5a4a4d]">
            {config.description}
          </p>
          {config.cta ? (
            <Link
              href={config.cta.href}
              className="mt-5 inline-flex w-fit items-center rounded-full bg-[#8b4a52] px-5 py-2.5 text-sm text-white"
            >
              {config.cta.label}
            </Link>
          ) : null}
        </section>

        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#5a4a4d]">
          {config.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckIcon />
              {feature}
            </li>
          ))}
        </ul>

        <section
          id="collection"
          className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]"
        >
          <aside className="hidden lg:block">{filters}</aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-full border border-[#ecd5d9] px-3 py-1.5 text-sm text-[#5a4a4d] lg:hidden"
                  onClick={() => setFiltersOpen(true)}
                >
                  Filters
                </button>
                <p className="text-sm text-[#5a4a4d]">
                  <span className="font-medium text-[#2f2426]">{filtered.length}</span>{" "}
                  products
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-[#5a4a4d]">
                  Sort by:
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortId)}
                    className="rounded-md border border-[#ecd5d9] bg-white px-2 py-1 text-sm text-[#2f2426] outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </label>
                <div className="flex overflow-hidden rounded-md border border-[#ecd5d9]">
                  <button
                    type="button"
                    aria-label="Grid view"
                    className={`p-1.5 ${view === "grid" ? "bg-[#8b4a52] text-white" : "bg-white text-[#8b4a52]"}`}
                    onClick={() => setView("grid")}
                  >
                    <GridIcon active={view === "grid"} />
                  </button>
                  <button
                    type="button"
                    aria-label="List view"
                    className={`p-1.5 ${view === "list" ? "bg-[#8b4a52] text-white" : "bg-white text-[#8b4a52]"}`}
                    onClick={() => setView("list")}
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#ecd5d9] bg-white px-6 py-16 text-center text-sm text-[#8a7a7d]">
                No pieces match those filters. Try clearing a few options.
              </p>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4"
                    : "grid gap-3"
                }
              >
                {filtered.map((product) => (
                  <CollectionCard
                    key={product.slug}
                    product={product}
                    layout={view}
                  />
                ))}
              </div>
            )}
            <AddProductPanel
              tab={config.tab}
              subcategories={config.subcategories}
              selectedSub={selectedSub}
            />
          </div>
        </section>
      </div>

      <section className="border-t border-[#f0e0e3] px-4 py-14 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="Why you'll love this collection" adornment="hearts" />
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {config.why.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#ecd5d9] bg-white text-[#8b4a52]">
                  <WhyIcon icon={item.icon} />
                </div>
                <h3 className="mt-4 font-serif text-lg text-[#2f2426]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#7a6a6d]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="You may also like"
            subtitle="Explore more handmade creations you'll love"
            adornment="none"
          />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {config.alsoLike.map((item) => (
              <Link
                key={item.name}
                href={`/product/${item.slug}`}
                className="group overflow-hidden rounded-2xl border border-[#f0e0e3] bg-white shadow-[0_2px_10px_rgba(139,74,82,0.05)]"
              >
                <div className="relative aspect-square bg-[#fcecee]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                </div>
                <div className="p-3">
                  <p className="font-serif text-sm text-[#2f2426]">{item.name}</p>
                  <p className="mt-0.5 text-sm text-[#c45b73]">
                    {formatINR(item.pricePaise)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {config.showInstagram ? <InstagramStrip /> : null}

      {filtersOpen ? (
        <div className="fixed inset-0 z-[400] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/35"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-cream px-5 py-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-serif text-lg text-[#2f2426]">Filters</p>
              <button
                type="button"
                className="text-sm text-[#8b4a52]"
                onClick={() => setFiltersOpen(false)}
              >
                Done
              </button>
            </div>
            {filters}
          </div>
        </div>
      ) : null}
    </main>
  );
}
