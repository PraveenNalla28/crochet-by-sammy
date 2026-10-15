"use client";

import { CategoryCollectionPage } from "@/components/collection/category-collection-page";
import {
  HOME_DECOR_ALSO_LIKE,
  HOME_DECOR_COLORS,
  HOME_DECOR_COPY,
  HOME_DECOR_OCCASIONS,
  HOME_DECOR_PRODUCTS,
  HOME_DECOR_SUBCATEGORIES,
  HOME_DECOR_WHY,
} from "@/data/home-decor-collection";

export function HomeDecorCollectionPage({
  initialSub,
}: {
  initialSub?: string;
}) {
  return (
    <CategoryCollectionPage
      initialSub={initialSub}
      config={{
        tab: "essentials",
        breadcrumb: "Home & Car Décor",
        eyebrow: HOME_DECOR_COPY.eyebrow,
        title: HOME_DECOR_COPY.title,
        description: HOME_DECOR_COPY.description,
        features: HOME_DECOR_COPY.features,
        subcategories: HOME_DECOR_SUBCATEGORIES,
        colors: HOME_DECOR_COLORS,
        extraFilterLabel: "Occasion",
        extraFilters: HOME_DECOR_OCCASIONS,
        products: HOME_DECOR_PRODUCTS,
        alsoLike: HOME_DECOR_ALSO_LIKE,
        why: HOME_DECOR_WHY,
        showInstagram: true,
      }}
    />
  );
}
