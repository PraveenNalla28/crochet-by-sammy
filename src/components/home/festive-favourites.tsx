"use client";

import Link from "next/link";
import { EditablePhoto } from "@/components/admin/editable-photo";
import { SectionHeading } from "@/components/home/section-heading";
import { FESTIVE_FAVOURITES } from "@/lib/home-content";
import { formatINR } from "@/lib/money";

export function FestiveFavourites() {
  return (
    <section className="bg-sand px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Festive Favourites"
          subtitle="Handmade for your special celebrations"
          adornment="hearts"
        />
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {FESTIVE_FAVOURITES.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-xl border border-[#ecd5d9]/50 bg-white shadow-[0_2px_12px_rgba(139,74,82,0.05)]"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <EditablePhoto
                  slot={`festive-${item.title}`}
                  fallback={item.image}
                  alt={item.title}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex items-center justify-between p-3.5">
                <div>
                  <p className="font-serif text-sm text-text-head">{item.title}</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Starting at {formatINR(item.priceFrom)}
                  </p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush-pale text-sm text-rose">
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
