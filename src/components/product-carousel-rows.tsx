"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";

function ProductRow({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScroll > 4 && el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, products]);

  function slide(direction: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-product-card]");
    const gap = 16;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.5;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  const overflow = canScrollLeft || canScrollRight;

  if (products.length === 0) return null;

  return (
    <div className="relative px-10 sm:px-12 md:px-14">
      {overflow && (
        <>
          <button
            type="button"
            onClick={() => slide(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous products"
            className="absolute left-0 top-[38%] z-10 flex -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 shadow-sm transition hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-30"
          >
            <IconChevronLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            disabled={!canScrollRight}
            aria-label="Next products"
            className="absolute right-0 top-[38%] z-10 flex -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 shadow-sm transition hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-30"
          >
            <IconChevronRight className="h-5 w-5 text-neutral-700" />
          </button>
        </>
      )}

      <div
        ref={trackRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 pt-0.5"
      >
        {products.map((product) => (
          <div
            key={product.slug}
            data-product-card
            className="w-[calc(50%-0.5rem)] shrink-0 snap-start sm:w-[calc(33.333%-0.7rem)] lg:w-[calc(25%-0.75rem)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export type CategoryRow = {
  title: string;
  rowCategory: string;
  products: Product[];
};

export function ProductCarouselRows({ rows }: { rows: CategoryRow[] }) {
  return (
    <div className="space-y-12 md:space-y-14">
      {rows.map((row) => (
        <section
          key={row.rowCategory}
          id={row.rowCategory}
          className="scroll-mt-24"
        >
          <h2 className="mb-6 font-serif text-2xl text-neutral-900 md:text-3xl">
            {row.title}
          </h2>
          <ProductRow products={row.products} />
        </section>
      ))}
    </div>
  );
}
