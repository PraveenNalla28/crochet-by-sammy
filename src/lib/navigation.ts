import { TAB_ROWS } from "@/data/products";
import type { ShopTab } from "@/lib/tabs";
import { sectionHref } from "@/lib/shop-paths";

export type NavDropdownItem = {
  label: string;
  href: string;
  id?: string;
  enabled?: boolean;
  extra?: boolean;
  tab?: ShopTab;
};

export type NavEntry =
  | { type: "link"; label: string; href: string }
  | {
      type: "dropdown";
      label: string;
      href: string;
      tab?: ShopTab;
      items: NavDropdownItem[];
    };

const TAB_LABELS: Record<ShopTab, string> = {
  home: "Home",
  women: "Women",
  kids: "Kids",
  essentials: "Essentials",
  gifts: "Gifts",
  miniatures: "Miniatures",
  "event-based": "Event Based",
};

function shopDropdown(tab: ShopTab, href: string): NavEntry {
  return {
    type: "dropdown",
    label: TAB_LABELS[tab],
    href,
    tab,
    items: TAB_ROWS[tab].map((row) => ({
      label: row.label,
      href: sectionHref(tab, row.rowCategory),
      id: row.rowCategory,
      enabled: true,
      extra: false,
      tab,
    })),
  };
}

export const MAIN_NAV: NavEntry[] = [
  { type: "link", label: "Home", href: "/" },
  {
    type: "dropdown",
    label: "About",
    href: "/about",
    items: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  shopDropdown("women", "/women"),
  shopDropdown("kids", "/kids"),
  shopDropdown("essentials", "/essentials"),
  shopDropdown("event-based", "/event-based"),
];
