export type ShopTab =
  | "home"
  | "women"
  | "kids"
  | "essentials"
  | "gifts"
  | "miniatures"
  | "event-based";

export const SHOP_TABS: { label: string; href: string; tab: ShopTab }[] = [
  { label: "Home", href: "/", tab: "home" },
  { label: "Women", href: "/women", tab: "women" },
  { label: "Kids", href: "/kids", tab: "kids" },
  { label: "Essentials", href: "/essentials", tab: "essentials" },
  { label: "Event based", href: "/event-based", tab: "event-based" },
];

export function tabFromPath(pathname: string): ShopTab {
  if (pathname.startsWith("/women")) return "women";
  if (pathname.startsWith("/kids")) return "kids";
  if (pathname.startsWith("/essentials")) return "essentials";
  if (pathname.startsWith("/gifts")) return "gifts";
  if (pathname.startsWith("/miniatures")) return "miniatures";
  if (pathname.startsWith("/event-based")) return "event-based";
  return "home";
}
