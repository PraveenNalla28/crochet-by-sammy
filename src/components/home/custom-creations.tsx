"use client";

import Link from "next/link";
import { EditablePhoto } from "@/components/admin/editable-photo";

const MINI_FEATURES = [
  "Personalized Design",
  "Perfect for Gifting",
  "Cherished Forever",
] as const;

export function CustomCreations() {
  return (
    <section className="bg-sand px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:justify-start">
          <div className="rotate-[-3deg] rounded-sm bg-white p-2 shadow-md">
            <div className="relative h-44 w-36 overflow-hidden bg-neutral-100 sm:h-52 sm:w-44">
              <EditablePhoto
                slot="custom-photo"
                fallback="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80"
                alt="Your photo for custom miniature"
                sizes="176px"
                className="object-cover"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-white/90 py-1 text-center text-[10px] font-medium text-text-body">
                Your Photo
              </p>
            </div>
          </div>
          <span
            className="hidden text-3xl font-light text-rose/60 sm:block"
            aria-hidden
          >
            →
          </span>
          <div className="relative h-48 w-40 overflow-hidden rounded-lg bg-white p-2 shadow-md sm:h-56 sm:w-44">
            <div className="relative h-full w-full overflow-hidden rounded">
              <EditablePhoto
                slot="custom-result"
                fallback="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                alt="Crochet miniature keepsake"
                sizes="176px"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center text-[10px] font-medium text-text-body">
              You & Me Always
            </p>
          </div>
        </div>
        <div className="text-center lg:text-left">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-rose-accent">
            CUSTOM CREATIONS
          </p>
          <h2 className="mt-3 font-serif text-[1.65rem] leading-snug text-text-head sm:text-3xl md:text-4xl">
            Turn Your Photo Into a Crochet Miniature
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-body md:text-base">
            A perfect keepsake for your loved ones. Handmade with love,
            personalized just for you.
          </p>
          <Link
            href="/miniatures"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-rose px-7 py-3.5 text-sm font-medium text-white transition hover:bg-maroon"
          >
            Start Custom Order
            <span aria-hidden>→</span>
          </Link>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-text-muted lg:justify-start md:text-sm">
            {MINI_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-rose" aria-hidden>
                  ✦
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
