"use client";

import { CategoryCollectionPage } from "@/components/collection/category-collection-page";
import {
  GIFTS_ALSO_LIKE,
  GIFTS_COLORS,
  GIFTS_COPY,
  GIFTS_OCCASIONS,
  GIFTS_PRODUCTS,
  GIFTS_SUBCATEGORIES,
  GIFTS_WHY,
} from "@/data/gifts-collection";

export function GiftsCollectionPage({ initialSub }: { initialSub?: string }) {
  return (
    <CategoryCollectionPage
      initialSub={initialSub}
      config={{
        tab: "gifts",
        breadcrumb: "Gifts & Keychains",
        eyebrow: GIFTS_COPY.eyebrow,
        title: GIFTS_COPY.title,
        description: GIFTS_COPY.description,
        features: GIFTS_COPY.features,
        subcategories: GIFTS_SUBCATEGORIES,
        colors: GIFTS_COLORS,
        extraFilterLabel: "Occasion",
        extraFilters: GIFTS_OCCASIONS,
        products: GIFTS_PRODUCTS,
        alsoLike: GIFTS_ALSO_LIKE,
        why: GIFTS_WHY,
        showInstagram: true,
      }}
    />
  );
}
