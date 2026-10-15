"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAdminMedia } from "@/components/admin/admin-media-context";
import { useShopCatalog } from "@/components/admin/shop-catalog-context";
import { ProductGallery } from "@/components/product/product-gallery";
import { IconHeart } from "@/components/icons";
import type { Product } from "@/data/products";
import { formatINR } from "@/lib/money";
import {
  applyProductEdit,
  paiseToRupeesInput,
  rupeesInputToPaise,
} from "@/lib/shop-catalog";

type Detail = Product & {
  subtitle?: string;
  inStock: boolean;
  images: string[];
  related: Product[];
  category: { label: string; href: string };
  subcategory: string;
  description: string;
};

export function ProductView({ detail }: { detail: Detail }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { isAdmin, mediaFor } = useAdminMedia();
  const { catalog, updateProduct } = useShopCatalog();
  const live = applyProductEdit(detail, catalog, { includeHidden: true }) ?? detail;
  const cover = mediaFor(`product-${detail.slug}`, live.imageUrl).src;
  const images = [cover, ...detail.images.filter((src) => src !== cover)];
  const [name, setName] = useState(live.name);
  const [price, setPrice] = useState(paiseToRupeesInput(live.pricePaise));

  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <nav className="mb-6 text-[13px] text-[#8a7a7d]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-[#8b4a52]">
                Home
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href={detail.category.href} className="hover:text-[#8b4a52]">
                {detail.category.label}
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="font-medium text-[#8b4a52]">{live.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <ProductGallery images={images} name={live.name} />

          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#8b4a52]">
              {detail.subcategory.toUpperCase()}
            </p>
            <h1 className="mt-2 font-serif text-3xl text-[#2f2426] md:text-4xl">
              {live.name}
            </h1>
            {detail.subtitle ? (
              <p className="mt-2 text-sm text-[#8a7a7d]">{detail.subtitle}</p>
            ) : null}
            <p className="mt-4 font-serif text-2xl text-[#c45b73]">
              {formatINR(live.pricePaise)}
            </p>
            {isAdmin ? (
              <div className="mt-4 space-y-2 rounded-2xl border border-[#ecd5d9] bg-white p-4">
                <p className="text-xs font-semibold tracking-wide text-[#8b4a52]">
                  Admin
                </p>
                <label className="block text-xs text-[#5a4a4d]">
                  Name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onBlur={() => {
                      const next = name.trim();
                      if (next && next !== live.name) {
                        updateProduct(detail.slug, { name: next });
                      }
                    }}
                    className="mt-1 w-full rounded-md border border-[#ecd5d9] px-3 py-2 text-sm text-[#2f2426] outline-none"
                  />
                </label>
                <label className="block text-xs text-[#5a4a4d]">
                  Price (₹)
                  <input
                    inputMode="numeric"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    onBlur={() => {
                      const next = rupeesInputToPaise(price);
                      if (next !== live.pricePaise) {
                        updateProduct(detail.slug, { pricePaise: next });
                      }
                    }}
                    className="mt-1 w-full rounded-md border border-[#ecd5d9] px-3 py-2 text-sm text-[#2f2426] outline-none"
                  />
                </label>
              </div>
            ) : null}
            <p className="mt-4 text-sm leading-relaxed text-[#5a4a4d]">
              {detail.description}
            </p>
            <p className="mt-4 text-sm text-[#5a4a4d]">
              {detail.inStock ? "In stock · Handmade to order" : "Currently unavailable"}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center overflow-hidden rounded-full border border-[#ecd5d9] bg-white">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="px-3 py-2 text-[#8b4a52]"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                >
                  −
                </button>
                <span className="min-w-8 text-center text-sm text-[#2f2426]">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="px-3 py-2 text-[#8b4a52]"
                  onClick={() => setQty((value) => value + 1)}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="rounded-full bg-[#8b4a52] px-6 py-2.5 text-sm text-white"
                onClick={() => setAdded(true)}
              >
                {added ? "Added to bag" : "Add to bag"}
              </button>
              <button
                type="button"
                aria-label="Save to wishlist"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ecd5d9] bg-white text-[#e08aa0]"
              >
                <IconHeart className="h-5 w-5" />
              </button>
            </div>

            {detail.tab === "miniatures" ? (
              <Link
                href="/contact"
                className="mt-4 inline-flex text-sm text-[#8b4a52] underline"
              >
                Prefer a custom order from your photo?
              </Link>
            ) : null}
          </div>
        </div>

        {detail.related.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-serif text-2xl text-[#2f2426]">More from this collection</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {detail.related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/product/${item.slug}`}
                  className="overflow-hidden rounded-2xl border border-[#f0e0e3] bg-white shadow-[0_2px_10px_rgba(139,74,82,0.05)]"
                >
                  <div className="relative aspect-square bg-[#fcecee]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
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
          </section>
        ) : null}
      </div>
    </main>
  );
}
