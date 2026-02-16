// ============================================
// Admin Users — Professional customer management
// ============================================

import { prisma } from "@/lib/prisma";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { orders: true } },
      orders: { select: { totalAmount: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as "RETAIL" | "WHOLESALE" | "ADMIN",
    createdAt: u.createdAt.toISOString(),
    _count: u._count,
    totalSpent: u.orders.reduce((sum, o) => sum + o.totalAmount, 0),
  }));

  return <AdminUsersClient users={serialized} />;
}
