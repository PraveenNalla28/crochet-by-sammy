import { MiniaturesCollectionPage } from "@/components/miniatures/miniatures-collection-page";
import { MINIATURES_SUBCATEGORIES } from "@/data/miniatures-collection";
import { redirectLegacySubQuery } from "@/lib/collection-route";

export default async function MiniaturesPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string }>;
}) {
  const { sub } = await searchParams;
  redirectLegacySubQuery("/miniatures", sub, MINIATURES_SUBCATEGORIES);
  return <MiniaturesCollectionPage />;
}
