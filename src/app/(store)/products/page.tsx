// ============================================
// Product Catalog — server-rendered product grid
// ============================================

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import ProductFilters from "@/components/store/ProductFilters";
import EmptyState from "@/components/ui/EmptyState";
import type { ProductWithTiers } from "@/types";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Collection",
  description: "Browse our full collection of premium men's suits, shirts, trousers, shoes, and accessories.",
};

type Props = {
  searchParams: Promise<{ search?: string; sort?: string; category?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { search, sort, category } = await searchParams;

  const orderBy =
    sort === "name"
      ? { name: "asc" as const }
      : sort === "price"
        ? { basePrice: "asc" as const }
        : sort === "newest" || !sort
          ? { createdAt: "desc" as const }
          : { createdAt: "desc" as const };

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }

  const products = await prisma.product.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include: {
      pricingTiers: { orderBy: { minQty: "asc" } },
      category: true,
    },
    orderBy,
  });

  // Cast to serializable type
  const serialized: ProductWithTiers[] = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    pricingTiers: p.pricingTiers.map((t) => ({ ...t })),
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-1 text-muted">
          Browse our collection — reseller pricing available on qualifying orders.
        </p>
      </div>

      <Suspense>
        <ProductFilters />
      </Suspense>

      {serialized.length === 0 ? (
        <EmptyState
          title="No products found"
          description={search ? `No results for "${search}"` : "Check back soon."}
        />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serialized.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
