// ============================================
// Add Product Page — Server component wrapper
// ============================================

import { prisma } from "@/lib/prisma";
import ProductFormClient from "./ProductFormClient";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return <ProductFormClient categories={serializedCategories} />;
}
