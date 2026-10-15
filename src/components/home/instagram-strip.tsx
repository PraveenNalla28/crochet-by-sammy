"use client";

import { EditablePhoto } from "@/components/admin/editable-photo";
import { INSTAGRAM_IMAGES } from "@/lib/home-content";

export function InstagramStrip() {
  return (
    <section className="bg-cream px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-serif text-[1.65rem] text-text-head sm:text-3xl md:text-4xl">
          Our Happy Creations
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Follow Us <span className="text-pink-accent">♥</span>
        </p>
        <p className="mt-1 text-xs text-text-muted/90">
          Tag us @crochet_by_sammu to be featured! ♥
        </p>
        <div className="scrollbar-hide mt-10 flex gap-2.5 overflow-x-auto pb-2 md:gap-3">
          {INSTAGRAM_IMAGES.map((src, i) => (
            <div
              key={src}
              className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-blush-pale md:h-36 md:w-36"
            >
              <EditablePhoto
                slot={`ig-${i}`}
                fallback={src}
                alt={`Creation ${i + 1}`}
                sizes="144px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
