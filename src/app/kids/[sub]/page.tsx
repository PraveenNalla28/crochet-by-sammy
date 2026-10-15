import { KidsCollectionPage } from "@/components/kids/kids-collection-page";
import { KIDS_SUBCATEGORIES } from "@/data/kids-collection";
import { requireCollectionSub } from "@/lib/collection-route";

export default async function KidsSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return (
    <KidsCollectionPage
      key={sub}
      initialSub={requireCollectionSub(sub, KIDS_SUBCATEGORIES)}
    />
  );
}
