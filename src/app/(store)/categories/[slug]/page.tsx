// ============================================
// Category Detail Page — products in a category
// ============================================

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductCard from "@/components/store/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import type { ProductWithTiers } from "@/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: { pricingTiers: { orderBy: { minQty: "asc" } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) return notFound();

  const serialized: ProductWithTiers[] = category.products.map((p) => ({
    ...p,
    slug: p.slug,
    images: p.images,
    stock: p.stock,
    sku: p.sku,
    featured: p.featured,
    categoryId: p.categoryId,
    createdAt: p.createdAt.toISOString(),
    pricingTiers: p.pricingTiers.map((t) => ({ ...t })),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Breadcrumbs
        items={[
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">{category.name}</h1>
        <p className="mt-1 text-muted">{category.description}</p>
        <p className="mt-1 text-sm text-muted-light">
          {serialized.length} {serialized.length === 1 ? "product" : "products"}
        </p>
      </div>

      {serialized.length === 0 ? (
        <EmptyState
          title="No products in this category"
          description="Check back soon for new arrivals."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {serialized.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
