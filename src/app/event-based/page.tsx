import { FestiveCollectionPage } from "@/components/festive/festive-collection-page";
import { FESTIVE_SUBCATEGORIES } from "@/data/festive-collection";
import { redirectLegacySubQuery } from "@/lib/collection-route";

export default async function EventBasedPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string }>;
}) {
  const { sub } = await searchParams;
  redirectLegacySubQuery("/event-based", sub, FESTIVE_SUBCATEGORIES);
  return <FestiveCollectionPage />;
}
