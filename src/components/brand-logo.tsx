import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/home-content";

export function BrandLogo({
  className = "",
  variant = "header",
}: {
  className?: string;
  variant?: "header" | "footer";
}) {
  const footer = variant === "footer";
  return (
    <Link
      href="/"
      className={`flex items-center gap-3 sm:gap-4 ${footer ? "max-w-none" : "min-w-0 max-w-full overflow-hidden"} ${className}`}
    >
      <span
        className={`relative shrink-0 overflow-hidden rounded-full bg-[#fcecee] ${
          footer
            ? "h-16 w-16"
            : "h-[62px] w-[62px] sm:h-[73px] sm:w-[73px] md:h-[88px] md:w-[88px]"
        }`}
      >
        <Image
          src="/images/logo.png"
          alt={BRAND.name}
          width={256}
          height={256}
          priority={!footer}
          className="h-full w-full scale-[1.08] object-cover"
        />
      </span>
      <div className={footer ? "text-left" : "min-w-0 flex-1 text-left"}>
        <span
          className={`brand-script block pb-0.5 leading-[1.15] text-[#5c3d42] ${
            footer
              ? "text-[1.45rem] whitespace-nowrap"
              : "truncate text-[1.35rem] sm:text-[1.8rem] md:text-[2.1rem]"
          }`}
        >
          {BRAND.name}
        </span>
        <span
          className={`mt-1.5 block font-serif font-semibold leading-none tracking-[0.14em] text-[#8b4a52] ${
            footer
              ? "text-[12px] whitespace-nowrap"
              : "truncate text-[12px] sm:mt-2 sm:text-[14px] md:text-[16px]"
          }`}
        >
          {BRAND.tagline}
        </span>
      </div>
    </Link>
  );
}
