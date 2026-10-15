import { MiniaturesCollectionPage } from "@/components/miniatures/miniatures-collection-page";
import { MINIATURES_SUBCATEGORIES } from "@/data/miniatures-collection";
import { requireCollectionSub } from "@/lib/collection-route";

export default async function MiniaturesSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return (
    <MiniaturesCollectionPage
      key={sub}
      initialSub={requireCollectionSub(sub, MINIATURES_SUBCATEGORIES)}
    />
  );
}
