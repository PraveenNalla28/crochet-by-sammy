import { TOP_BAR } from "@/lib/home-content";

export function TopAnnouncementBar() {
  return (
    <div className="bg-rose px-3 py-2.5 text-center text-[11px] leading-snug text-white sm:text-xs md:text-sm">
      <span aria-hidden>♥ </span>
      {TOP_BAR}
      <span aria-hidden> ♥</span>
    </div>
  );
}
