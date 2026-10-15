import { HomeDecorCollectionPage } from "@/components/home-decor/home-decor-collection-page";
import { HOME_DECOR_SUBCATEGORIES } from "@/data/home-decor-collection";
import { requireCollectionSub } from "@/lib/collection-route";

export default async function EssentialsSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return (
    <HomeDecorCollectionPage
      key={sub}
      initialSub={requireCollectionSub(sub, HOME_DECOR_SUBCATEGORIES)}
    />
  );
}
