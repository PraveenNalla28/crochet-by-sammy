"use client";

import { CategoryCollectionPage } from "@/components/collection/category-collection-page";
import {
  KIDS_AGE_USES,
  KIDS_ALSO_LIKE,
  KIDS_COLORS,
  KIDS_COPY,
  KIDS_PRODUCTS,
  KIDS_SUBCATEGORIES,
  KIDS_WHY,
} from "@/data/kids-collection";

export function KidsCollectionPage({ initialSub }: { initialSub?: string }) {
  return (
    <CategoryCollectionPage
      initialSub={initialSub}
      config={{
        tab: "kids",
        breadcrumb: "Kids' Collection",
        eyebrow: KIDS_COPY.eyebrow,
        title: KIDS_COPY.title,
        description: KIDS_COPY.description,
        features: KIDS_COPY.features,
        subcategories: KIDS_SUBCATEGORIES,
        colors: KIDS_COLORS,
        extraFilterLabel: "Age / Use",
        extraFilters: KIDS_AGE_USES,
        products: KIDS_PRODUCTS,
        alsoLike: KIDS_ALSO_LIKE,
        why: KIDS_WHY,
        showInstagram: true,
      }}
    />
  );
}
