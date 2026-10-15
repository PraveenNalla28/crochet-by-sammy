"use client";

import Link from "next/link";
import { EditablePhoto } from "@/components/admin/editable-photo";
import { SectionHeading } from "@/components/home/section-heading";
import { SHOP_CATEGORIES } from "@/lib/home-content";

export function ShopByCategory() {
  return (
    <section className="bg-cream px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Shop by Category"
          subtitle="Explore our handmade collections for every occasion"
          adornment="yarn"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SHOP_CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group overflow-hidden rounded-xl border border-[#ecd5d9]/80 bg-white shadow-[0_2px_12px_rgba(139,74,82,0.06)] transition hover:shadow-[0_4px_20px_rgba(139,74,82,0.1)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <EditablePhoto
                  slot={`cat-${cat.title}`}
                  fallback={cat.image}
                  alt={cat.title}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="relative flex items-start justify-between gap-3 p-4 pb-5">
                <div>
                  <h3 className="font-serif text-lg text-text-head">{cat.title}</h3>
                  <p className="mt-1 text-xs text-text-muted">{cat.description}</p>
                </div>
                <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-blush-pale text-sm text-rose">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
