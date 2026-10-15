import type { ShopTab } from "@/lib/tabs";
import { getRowsForTab } from "@/data/products";
import { ProductCarouselRows } from "@/components/product-carousel-rows";

export function ProductGrid({ tab }: { tab: ShopTab }) {
  const rows = getRowsForTab(tab);
  return <ProductCarouselRows rows={rows} />;
}
