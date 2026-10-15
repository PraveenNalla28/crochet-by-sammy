"use client";

import Link from "next/link";
import { EditablePhoto } from "@/components/admin/editable-photo";
import { SectionHeading } from "@/components/home/section-heading";
import { BEST_SELLERS } from "@/lib/home-content";
import { formatINR } from "@/lib/money";

export function BestSellers() {
  return (
    <section className="bg-cream px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Best Sellers"
          subtitle="Customer loved crochet creations"
          adornment="hearts"
        />
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {BEST_SELLERS.map((item) => (
            <Link
              key={item.name}
              href={`/product/${item.slug}`}
              className="group overflow-hidden rounded-xl border border-[#ecd5d9]/60 bg-white shadow-[0_2px_12px_rgba(139,74,82,0.05)]"
            >
              <div className="relative aspect-square bg-blush-pale/40">
                <EditablePhoto
                  slot={`best-${item.slug}`}
                  fallback={item.image}
                  alt={item.name}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <span className="absolute right-2.5 top-2.5 text-base text-pink-accent">
                  ♥
                </span>
              </div>
              <div className="flex items-end justify-between gap-2 p-3.5">
                <div>
                  <p className="font-serif text-sm text-text-head md:text-base">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-sm text-text-muted">
                    {formatINR(item.pricePaise)}
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-pale text-rose">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                    <path
                      d="M6 7h12l-1.5 10H7.5L6 7zm0 0L5 4H3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
