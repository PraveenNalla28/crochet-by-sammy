import { notFound, redirect } from "next/navigation";

export function requireCollectionSub(
  sub: string,
  allowed: readonly { id: string }[] = [],
) {
  if (allowed.some((item) => item.id === sub)) return sub;
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sub) && sub.length >= 2 && sub.length <= 60) {
    return sub;
  }
  notFound();
}

export function redirectLegacySubQuery(
  basePath: string,
  sub: string | undefined,
  allowed: readonly { id: string }[],
) {
  if (sub && allowed.some((item) => item.id === sub)) {
    redirect(`${basePath}/${sub}`);
  }
}
