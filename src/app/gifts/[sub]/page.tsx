import { GiftsCollectionPage } from "@/components/gifts/gifts-collection-page";
import { GIFTS_SUBCATEGORIES } from "@/data/gifts-collection";
import { requireCollectionSub } from "@/lib/collection-route";

export default async function GiftsSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  return (
    <GiftsCollectionPage
      key={sub}
      initialSub={requireCollectionSub(sub, GIFTS_SUBCATEGORIES)}
    />
  );
}
