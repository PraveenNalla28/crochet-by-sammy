import { NextResponse } from "next/server";
import { readShopCatalog, saveShopCatalog } from "@/lib/shop-catalog-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await readShopCatalog();
  return NextResponse.json(
    { catalog },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { catalog?: unknown };
  const catalog = await saveShopCatalog(body.catalog);
  return NextResponse.json({ catalog });
}
