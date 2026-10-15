import { WomensAccessoriesPage } from "@/components/women/womens-accessories-page";
import { WOMEN_SUBCATEGORIES } from "@/data/womens-accessories";
import { requireCollectionSub } from "@/lib/collection-route";

export default async function WomenSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return (
    <WomensAccessoriesPage
      key={sub}
      initialSub={requireCollectionSub(sub, WOMEN_SUBCATEGORIES)}
    />
  );
}
