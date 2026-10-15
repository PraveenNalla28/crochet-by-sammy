"use client";

import { CategoryCollectionPage } from "@/components/collection/category-collection-page";
import {
  WOMEN_ALSO_LIKE,
  WOMEN_COLORS,
  WOMEN_HERO,
  WOMEN_OCCASIONS,
  WOMEN_PRODUCTS,
  WOMEN_SUBCATEGORIES,
} from "@/data/womens-accessories";

export function WomensAccessoriesPage({
  initialSub,
}: {
  initialSub?: string;
}) {
  return (
    <CategoryCollectionPage
      initialSub={initialSub}
      config={{
        tab: "women",
        breadcrumb: "Women's Accessories",
        eyebrow: WOMEN_HERO.eyebrow,
        title: WOMEN_HERO.title,
        description: WOMEN_HERO.description,
        features: WOMEN_HERO.features,
        subcategories: WOMEN_SUBCATEGORIES,
        colors: WOMEN_COLORS,
        extraFilterLabel: "Occasion",
        extraFilters: WOMEN_OCCASIONS,
        products: WOMEN_PRODUCTS,
        alsoLike: WOMEN_ALSO_LIKE,
        why: [
          {
            title: "100% Handmade",
            text: "Every piece is crafted with love and care.",
            icon: "heart",
          },
          {
            title: "Lightweight & Comfortable",
            text: "Perfect for everyday wear without compromising on style.",
            icon: "soft",
          },
          {
            title: "Gift-worthy",
            text: "A thoughtful handmade gift for your loved ones.",
            icon: "gift",
          },
        ],
      }}
    />
  );
}
