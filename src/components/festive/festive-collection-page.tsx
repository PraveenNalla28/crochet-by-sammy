"use client";

import { CategoryCollectionPage } from "@/components/collection/category-collection-page";
import {
  FESTIVE_ALSO_LIKE,
  FESTIVE_COLORS,
  FESTIVE_COPY,
  FESTIVE_OCCASIONS,
  FESTIVE_PRODUCTS,
  FESTIVE_SUBCATEGORIES,
  FESTIVE_WHY,
} from "@/data/festive-collection";

export function FestiveCollectionPage({ initialSub }: { initialSub?: string }) {
  return (
    <CategoryCollectionPage
      initialSub={initialSub}
      config={{
        tab: "event-based",
        breadcrumb: "Festive & Devotional",
        eyebrow: FESTIVE_COPY.eyebrow,
        title: FESTIVE_COPY.title,
        description: FESTIVE_COPY.description,
        features: FESTIVE_COPY.features,
        subcategories: FESTIVE_SUBCATEGORIES,
        colors: FESTIVE_COLORS,
        extraFilterLabel: "Occasion",
        extraFilters: FESTIVE_OCCASIONS,
        products: FESTIVE_PRODUCTS,
        alsoLike: FESTIVE_ALSO_LIKE,
        why: FESTIVE_WHY,
        showInstagram: true,
      }}
    />
  );
}
