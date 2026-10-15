import { KidsCollectionPage } from "@/components/kids/kids-collection-page";
import { KIDS_SUBCATEGORIES } from "@/data/kids-collection";
import { redirectLegacySubQuery } from "@/lib/collection-route";

export default async function KidsPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string }>;
}) {
  const { sub } = await searchParams;
  redirectLegacySubQuery("/kids", sub, KIDS_SUBCATEGORIES);
  return <KidsCollectionPage />;
}
