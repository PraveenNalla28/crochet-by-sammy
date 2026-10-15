import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatINR } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <article className="overflow-hidden rounded-lg bg-neutral-50 ring-1 ring-neutral-200/80 transition hover:ring-neutral-300">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <div className="px-3 py-4 text-center">
          <h2 className="font-serif text-base text-neutral-900 md:text-lg">
            {product.name}
          </h2>
          <p className="mt-1.5 text-sm text-neutral-600">
            {formatINR(product.pricePaise)}
          </p>
        </div>
      </article>
    </Link>
  );
}
