import type { ShopTab } from "@/lib/tabs";
import { ProductGrid } from "@/components/product-grid";
import { ScrollToHash } from "@/components/scroll-to-hash";

export function CatalogPage({ tab }: { tab: ShopTab }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <ScrollToHash />
      <ProductGrid tab={tab} />
    </main>
  );
}
