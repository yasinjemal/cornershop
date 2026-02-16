// ============================================
// Admin Orders — Professional order management
// ============================================

import { prisma } from "@/lib/prisma";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = orders.map((o) => ({
    id: o.id,
    userId: o.userId,
    totalAmount: o.totalAmount,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    user: {
      id: o.user.id,
      name: o.user.name,
      email: o.user.email,
      role: o.user.role,
      createdAt: o.user.createdAt.toISOString(),
    },
    items: o.items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        description: item.product.description,
        basePrice: item.product.basePrice,
        imageUrl: item.product.imageUrl,
        images: item.product.images,
        stock: item.product.stock,
        sku: item.product.sku,
        featured: item.product.featured,
        categoryId: item.product.categoryId,
        createdAt: item.product.createdAt.toISOString(),
        pricingTiers: [],
      },
    })),
  }));

  return <AdminOrdersClient orders={serialized} />;
}
