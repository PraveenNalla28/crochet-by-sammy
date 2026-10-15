import { GiftsCollectionPage } from "@/components/gifts/gifts-collection-page";
import { GIFTS_SUBCATEGORIES } from "@/data/gifts-collection";
import { redirectLegacySubQuery } from "@/lib/collection-route";

export default async function GiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string }>;
}) {
  const { sub } = await searchParams;
  redirectLegacySubQuery("/gifts", sub, GIFTS_SUBCATEGORIES);
  return <GiftsCollectionPage />;
}
