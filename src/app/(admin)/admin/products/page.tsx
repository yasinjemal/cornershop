// ============================================
// Admin Products — Professional product list
// ============================================

import { prisma } from "@/lib/prisma";
import AdminProductsClient from "./AdminProductsClient";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      pricingTiers: { orderBy: { minQty: "asc" } },
      category: true,
      _count: { select: { orderItems: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    basePrice: p.basePrice,
    imageUrl: p.imageUrl,
    images: p.images,
    stock: p.stock,
    sku: p.sku,
    featured: p.featured,
    categoryId: p.categoryId,
    categoryName: p.category?.name || null,
    createdAt: p.createdAt.toISOString(),
    pricingTiers: p.pricingTiers.map((t) => ({
      id: t.id,
      productId: t.productId,
      minQty: t.minQty,
      pricePerUnit: t.pricePerUnit,
    })),
    _count: p._count,
  }));

  return <AdminProductsClient products={serialized} />;
}
