"use client";

import Link from "next/link";
import { EditablePhoto } from "@/components/admin/editable-photo";
import { useAdminMedia } from "@/components/admin/admin-media-context";
import { HERO } from "@/lib/home-content";

const TEXT_SWATCHES = [
  "#ffffff",
  "#fcf9f6",
  "#f3e0c8",
  "#000000",
  "#2f2426",
  "#5a4a4d",
  "#1e3a5f",
  "#3d4f3a",
  "#8b4a52",
  "#b76e79",
  "#c45c26",
  "#7a4e1d",
  "#4a7c6f",
  "#6b4c9a",
  "#d4a017",
] as const;

function FeatureIcon({ kind }: { kind: "star" | "heart" | "pin" }) {
  if (kind === "star") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2.6l2.7 5.7 6.3.7-4.7 4.3 1.3 6.2L12 16.8 6.4 19.5l1.3-6.2-4.7-4.3 6.3-.7L12 2.6z"
        />
      </svg>
    );
  }
  if (kind === "heart") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
        <path
          fill="currentColor"
          d="M12 21s-6.8-4.4-9.2-8.8C1.1 9.2 3.2 6 6.5 6c1.7 0 3.2 1 4.1 2.5C11.5 7 13 6 14.7 6c3.3 0 5.4 3.2 3.7 6.2C18.8 16.6 12 21 12 21z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
      <path
        fill="currentColor"
        d="M12 22s7-6.6 7-12.2A7 7 0 0012 3a7 7 0 00-7 6.8C5 15.4 12 22 12 22zm0-9.2a2.2 2.2 0 110-4.4 2.2 2.2 0 010 4.4z"
      />
    </svg>
  );
}

const FEATURE_KINDS = ["star", "heart", "pin"] as const;

function HeroTextColorPicker() {
  const { isAdmin, heroTextColor, setHeroTextColor } = useAdminMedia();
  if (!isAdmin) return null;
  return (
    <div className="relative z-20 flex flex-wrap items-center gap-2 px-4 py-3 md:px-10 lg:px-14">
      <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-semibold tracking-wide text-[#5a4a4d]">
        Hero text color
      </span>
      <input
        type="color"
        value={heroTextColor}
        onChange={(e) => setHeroTextColor(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded-full border border-[#ecd5d9] bg-white p-0"
        aria-label="Pick hero text color"
      />
      {TEXT_SWATCHES.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`Use ${color}`}
          className="h-6 w-6 rounded-full border border-[#d8c9c4]"
          style={{ background: color }}
          onClick={() => setHeroTextColor(color)}
        />
      ))}
    </div>
  );
}

function HeroCopy({ color }: { color: string }) {
  return (
    <div className="max-w-xl" style={{ color }}>
      <p className="text-[11px] font-semibold tracking-[0.22em] md:text-xs">
        {HERO.eyebrow}
      </p>
      <h1 className="mt-3 font-serif text-[1.85rem] leading-[1.1] sm:text-[2.15rem] md:text-5xl lg:text-[3.35rem]">
        {HERO.title}{" "}
        <span aria-hidden>♥</span>
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed md:mt-4 md:text-[15px]">
        {HERO.subtitle}
      </p>
      <Link
        href="/women"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-7 py-3.5 text-sm font-medium sm:w-auto md:mt-7"
        style={{ borderColor: color, color, background: "transparent" }}
      >
        {HERO.cta}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

function HeroFeatures({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <ul className={className} style={{ color }}>
      {HERO.features.map((f, i) => (
        <li key={f} className="flex items-center gap-2">
          <FeatureIcon kind={FEATURE_KINDS[i]} />
          {f}
        </li>
      ))}
    </ul>
  );
}

export function HeroSection() {
  const { heroTextColor } = useAdminMedia();

  return (
    <section className="relative w-full overflow-x-hidden bg-cream">
      <div className="relative h-[260px] w-full overflow-hidden md:h-auto md:min-h-[460px] lg:min-h-[500px]">
        <EditablePhoto
          slot="hero"
          fallback={HERO.image}
          alt="Handmade crochet bunny, bag, hair accessories and wall hanging"
          sizes="100vw"
          className="object-cover"
          objectPosition="top"
          priority
        />
        <div
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-cream from-0% via-cream via-[50%] to-transparent to-[85%] md:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 md:hidden"
          aria-hidden
        />
        <div className="absolute inset-x-0 top-0 z-20">
          <HeroTextColorPicker />
        </div>
        <div className="relative z-10 mx-auto flex h-full min-h-[260px] max-w-7xl flex-col justify-end px-5 pb-14 pt-8 md:min-h-[460px] md:justify-center md:px-10 md:pb-28 md:pt-16 lg:min-h-[500px] lg:px-14">
          <HeroCopy color={heroTextColor} />
        </div>
        <HeroFeatures
          color={heroTextColor}
          className="absolute bottom-5 left-5 z-10 flex flex-wrap gap-x-5 gap-y-2 font-serif text-xs font-semibold [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] md:bottom-8 md:left-10 md:gap-x-8 md:text-sm lg:left-14 lg:bottom-10 lg:gap-x-10"
        />
        <p
          className="brand-script absolute bottom-10 right-5 z-10 hidden max-w-[160px] text-right text-base leading-snug md:block lg:right-14 lg:text-lg"
          style={{ color: heroTextColor }}
        >
          Small stitches
          <br />
          Big happiness
          <span className="mt-0.5 block text-xl" aria-hidden>
            ♡
          </span>
        </p>
      </div>
    </section>
  );
}
