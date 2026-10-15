import { notFound } from "next/navigation";
import { ProductView } from "@/components/product/product-view";
import { PRODUCTS } from "@/data/products";
import { getProductDetail } from "@/lib/product-detail";
import { readShopCatalog } from "@/lib/shop-catalog-store";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const catalog = await readShopCatalog();
  const detail = getProductDetail(slug, catalog);
  if (!detail) return { title: "Product" };
  return { title: `${detail.name} | crochet_by_sammu` };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const catalog = await readShopCatalog();
  const detail = getProductDetail(slug, catalog);
  if (!detail) notFound();
  return <ProductView detail={detail} />;
}
