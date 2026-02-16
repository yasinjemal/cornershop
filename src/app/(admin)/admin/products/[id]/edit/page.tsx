// ============================================
// Edit Product Page — Server component wrapper
// ============================================

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductFormClient from "../../new/ProductFormClient";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { pricingTiers: { orderBy: { minQty: "asc" } }, category: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    basePrice: product.basePrice.toString(),
    stock: product.stock.toString(),
    sku: product.sku,
    featured: product.featured,
    categoryId: product.categoryId || "",
    pricingTiers: product.pricingTiers.map((t) => ({
      minQty: t.minQty,
      pricePerUnit: t.pricePerUnit,
    })),
    media: [
      ...(product.imageUrl
        ? [{ id: "main", url: product.imageUrl, type: "image" as const, name: "Main Image" }]
        : []),
      ...(product.images || [])
        .filter((img) => img !== product.imageUrl)
        .map((img, i) => ({
          id: `img-${i}`,
          url: img,
          type: "image" as const,
          name: `Image ${i + 2}`,
        })),
    ],
  };

  return <ProductFormClient categories={serializedCategories} initialData={initialData} />;
}
