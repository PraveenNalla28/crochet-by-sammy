import type { ShopTab } from "@/lib/tabs";
import { FESTIVE_PRODUCTS } from "@/data/festive-collection";
import { GIFTS_PRODUCTS } from "@/data/gifts-collection";
import { HOME_DECOR_PRODUCTS } from "@/data/home-decor-collection";
import { KIDS_PRODUCTS } from "@/data/kids-collection";
import { MINIATURES_PRODUCTS } from "@/data/miniatures-collection";
import { WOMEN_PRODUCTS } from "@/data/womens-accessories";

export type Product = {
  slug: string;
  name: string;
  pricePaise: number;
  imageUrl: string;
  tab: ShopTab;
  /** Row group label within a tab (e.g. toys, keychains, bags). */
  rowCategory: string;
};

type RowConfig = { label: string; rowCategory: string };

export const TAB_ROWS: Record<ShopTab, RowConfig[]> = {
  home: [
    { label: "Toys", rowCategory: "toys" },
    { label: "Key chains", rowCategory: "keychains" },
  ],
  women: [
    { label: "Hair Clips", rowCategory: "hair-clips" },
    { label: "Hair Bands", rowCategory: "hair-bands" },
    { label: "Handbags", rowCategory: "handbags" },
    { label: "Gift Accessories", rowCategory: "gift-accessories" },
  ],
  kids: [
    { label: "Toys", rowCategory: "toys" },
    { label: "Kids Bags", rowCategory: "kids-bags" },
    { label: "Play Accessories", rowCategory: "play-accessories" },
    { label: "Baby Gifts", rowCategory: "baby-gifts" },
  ],
  essentials: [
    { label: "Wall Hangings", rowCategory: "wall-hangings" },
    { label: "Table Décor", rowCategory: "table-decor" },
    { label: "Car Charms", rowCategory: "car-charms" },
    { label: "Door/Wall Hangings", rowCategory: "door-hangings" },
    { label: "Gift Décor", rowCategory: "gift-decor" },
  ],
  gifts: [
    { label: "Keychains", rowCategory: "keychains" },
    { label: "Bag Charms", rowCategory: "bag-charms" },
    { label: "Mini Gifts", rowCategory: "mini-gifts" },
    { label: "Gift Pouches", rowCategory: "gift-pouches" },
    { label: "Return Gifts", rowCategory: "return-gifts" },
  ],
  miniatures: [
    { label: "Couple Dolls", rowCategory: "couple-dolls" },
    { label: "Family Miniatures", rowCategory: "family-miniatures" },
    { label: "Custom Portrait Dolls", rowCategory: "portrait-dolls" },
    { label: "Pet Miniatures", rowCategory: "pet-miniatures" },
    { label: "Gift Keepsakes", rowCategory: "gift-keepsakes" },
  ],
  "event-based": [
    { label: "Rakhi Collection", rowCategory: "rakhi-collection" },
    { label: "Crochet Idols", rowCategory: "crochet-idols" },
    { label: "Festive Décor", rowCategory: "festive-decor" },
    { label: "Return Gifts", rowCategory: "return-gifts" },
    { label: "Pooja Décor", rowCategory: "pooja-decor" },
  ],
};

export const PRODUCTS: Product[] = [
  {
    slug: "cute-teddy",
    name: "Cute Teddy",
    pricePaise: 49900,
    tab: "home",
    rowCategory: "toys",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    slug: "amigurumi-bunny",
    name: "Amigurumi Bunny",
    pricePaise: 65000,
    tab: "home",
    rowCategory: "toys",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    slug: "soft-duck",
    name: "Soft Duck",
    pricePaise: 55000,
    tab: "home",
    rowCategory: "toys",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    slug: "mini-elephant",
    name: "Mini Elephant",
    pricePaise: 72000,
    tab: "home",
    rowCategory: "toys",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    slug: "sleepy-bear",
    name: "Sleepy Bear",
    pricePaise: 58000,
    tab: "home",
    rowCategory: "toys",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    slug: "keychain",
    name: "Classic Keychain",
    pricePaise: 29900,
    tab: "home",
    rowCategory: "keychains",
    imageUrl:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
  },
  {
    slug: "heart-keychain",
    name: "Heart Keychain",
    pricePaise: 32000,
    tab: "home",
    rowCategory: "keychains",
    imageUrl:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
  },
  {
    slug: "flower-keychain",
    name: "Flower Keychain",
    pricePaise: 35000,
    tab: "home",
    rowCategory: "keychains",
    imageUrl:
      "https://images.unsplash.com/photo-1582794543134-8b25d8689586?w=800&q=80",
  },
  {
    slug: "star-keychain",
    name: "Star Keychain",
    pricePaise: 28000,
    tab: "home",
    rowCategory: "keychains",
    imageUrl:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
  },
  {
    slug: "mini-bear-keychain",
    name: "Mini Bear Keychain",
    pricePaise: 38000,
    tab: "home",
    rowCategory: "keychains",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    slug: "sunflower-keychain",
    name: "Sunflower Keychain",
    pricePaise: 34000,
    tab: "home",
    rowCategory: "keychains",
    imageUrl:
      "https://images.unsplash.com/photo-1597848219624-1fb5145f2caa?w=800&q=80",
  },
  ...WOMEN_PRODUCTS.map((item) => ({
    slug: item.slug,
    name: item.name,
    pricePaise: item.pricePaise,
    imageUrl: item.imageUrl,
    tab: "women" as const,
    rowCategory: item.rowCategory,
  })),
  ...KIDS_PRODUCTS.map((item) => ({
    slug: item.slug,
    name: item.name,
    pricePaise: item.pricePaise,
    imageUrl: item.imageUrl,
    tab: "kids" as const,
    rowCategory: item.rowCategory,
  })),
  ...HOME_DECOR_PRODUCTS.map((item) => ({
    slug: item.slug,
    name: item.name,
    pricePaise: item.pricePaise,
    imageUrl: item.imageUrl,
    tab: "essentials" as const,
    rowCategory: item.rowCategory,
  })),
  ...GIFTS_PRODUCTS.map((item) => ({
    slug: item.slug,
    name: item.name,
    pricePaise: item.pricePaise,
    imageUrl: item.imageUrl,
    tab: "gifts" as const,
    rowCategory: item.rowCategory,
  })),
  ...MINIATURES_PRODUCTS.map((item) => ({
    slug: item.slug,
    name: item.name,
    pricePaise: item.pricePaise,
    imageUrl: item.imageUrl,
    tab: "miniatures" as const,
    rowCategory: item.rowCategory,
  })),
  ...FESTIVE_PRODUCTS.map((item) => ({
    slug: item.slug,
    name: item.name,
    pricePaise: item.pricePaise,
    imageUrl: item.imageUrl,
    tab: "event-based" as const,
    rowCategory: item.rowCategory,
  })),
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRowsForTab(tab: ShopTab) {
  return TAB_ROWS[tab].map(({ label, rowCategory }) => ({
    title: label,
    rowCategory,
    products: PRODUCTS.filter(
      (p) => p.tab === tab && p.rowCategory === rowCategory,
    ),
  }));
}
