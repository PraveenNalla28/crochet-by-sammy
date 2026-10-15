import { WomensAccessoriesPage } from "@/components/women/womens-accessories-page";
import { WOMEN_SUBCATEGORIES } from "@/data/womens-accessories";
import { redirectLegacySubQuery } from "@/lib/collection-route";

export default async function WomenPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string }>;
}) {
  const { sub } = await searchParams;
  redirectLegacySubQuery("/women", sub, WOMEN_SUBCATEGORIES);
  return <WomensAccessoriesPage />;
}
