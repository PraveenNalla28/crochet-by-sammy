"use client";

import Image from "next/image";
import { useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  const count = images.length;

  function go(step: number) {
    if (count < 2) return;
    setIndex((value) => (value + step + count) % count);
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#fcecee]">
        {current ? (
          <Image
            src={current}
            alt={`${name} photo ${index + 1}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : null}
        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#8b4a52] shadow"
              onClick={() => go(-1)}
            >
              <IconChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#8b4a52] shadow"
              onClick={() => go(1)}
            >
              <IconChevronRight className="h-5 w-5" />
            </button>
            <p className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs text-[#5a4a4d]">
              {index + 1} / {count}
            </p>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              aria-label={`View image ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                i === index ? "border-[#8b4a52]" : "border-transparent"
              }`}
              onClick={() => setIndex(i)}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
