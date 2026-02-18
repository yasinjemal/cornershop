// ============================================
// Orders API — GET all / POST create
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders — place an order (with stock validation)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, items } = body as {
      userId: string;
      items: { productId: string; quantity: number; priceAtPurchase: number }[];
    };

    if (!userId || !items?.length) {
      return NextResponse.json(
        { success: false, error: "userId and items are required" },
        { status: 400 }
      );
    }

    // Validate stock availability for all items
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, stock: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
          },
          { status: 400 }
        );
      }
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.priceAtPurchase,
      0
    );

    // Create order and decrement stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock for each item
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create the order
      return tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.priceAtPurchase,
            })),
          },
        },
        include: {
          user: true,
          items: { include: { product: true } },
        },
      });
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
