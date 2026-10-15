import { FestiveCollectionPage } from "@/components/festive/festive-collection-page";
import { FESTIVE_SUBCATEGORIES } from "@/data/festive-collection";
import { requireCollectionSub } from "@/lib/collection-route";

export default async function EventBasedSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return (
    <FestiveCollectionPage
      key={sub}
      initialSub={requireCollectionSub(sub, FESTIVE_SUBCATEGORIES)}
    />
  );
}
