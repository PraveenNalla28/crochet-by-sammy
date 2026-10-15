"use client";

import { CategoryCollectionPage } from "@/components/collection/category-collection-page";
import {
  MINIATURES_ALSO_LIKE,
  MINIATURES_COPY,
  MINIATURES_OCCASIONS,
  MINIATURES_PRICE_RANGES,
  MINIATURES_PRODUCTS,
  MINIATURES_STYLES,
  MINIATURES_SUBCATEGORIES,
  MINIATURES_WHY,
} from "@/data/miniatures-collection";

export function MiniaturesCollectionPage({
  initialSub,
}: {
  initialSub?: string;
}) {
  return (
    <CategoryCollectionPage
      initialSub={initialSub}
      config={{
        tab: "miniatures",
        breadcrumb: "Personalized Miniatures",
        eyebrow: MINIATURES_COPY.eyebrow,
        title: MINIATURES_COPY.title,
        description: MINIATURES_COPY.description,
        features: MINIATURES_COPY.features,
        subcategories: MINIATURES_SUBCATEGORIES,
        priceRanges: MINIATURES_PRICE_RANGES,
        availabilityLabel: "Made to Order",
        extraFilterLabel: "Occasion",
        extraFilters: MINIATURES_OCCASIONS,
        styleFilterLabel: "Style / Use",
        styleFilters: MINIATURES_STYLES,
        cta: { label: "Start Custom Order", href: "/contact" },
        products: MINIATURES_PRODUCTS,
        alsoLike: MINIATURES_ALSO_LIKE,
        why: MINIATURES_WHY,
        showInstagram: true,
      }}
    />
  );
}
