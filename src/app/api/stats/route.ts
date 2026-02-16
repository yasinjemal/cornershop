// ============================================
// Dashboard Stats API — GET aggregate stats
// ============================================

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({ select: { totalAmount: true, status: true } }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
    const deliveredOrders = orders.filter(
      (o) => o.status === "DELIVERED"
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
