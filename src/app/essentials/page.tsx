import { HomeDecorCollectionPage } from "@/components/home-decor/home-decor-collection-page";
import { HOME_DECOR_SUBCATEGORIES } from "@/data/home-decor-collection";
import { redirectLegacySubQuery } from "@/lib/collection-route";

export default async function EssentialsPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string }>;
}) {
  const { sub } = await searchParams;
  redirectLegacySubQuery("/essentials", sub, HOME_DECOR_SUBCATEGORIES);
  return <HomeDecorCollectionPage />;
}
