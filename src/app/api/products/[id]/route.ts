// ============================================
// Single Product API — GET / PUT / DELETE
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { pricingTiers: { orderBy: { minQty: "asc" } }, category: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] — update product
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, basePrice, imageUrl, pricingTiers, slug, stock, sku, featured, images, categoryId } = body;

    // Delete existing tiers and re-create
    await prisma.pricingTier.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(basePrice != null && { basePrice: parseFloat(basePrice) }),
        ...(imageUrl && { imageUrl }),
        ...(slug && { slug }),
        ...(stock != null && { stock: parseInt(stock) }),
        ...(sku && { sku }),
        ...(featured != null && { featured }),
        ...(images && { images }),
        ...(categoryId !== undefined && { categoryId }),
        pricingTiers: pricingTiers?.length
          ? {
              create: pricingTiers.map(
                (t: { minQty: number; pricePerUnit: number }) => ({
                  minQty: t.minQty,
                  pricePerUnit: t.pricePerUnit,
                })
              ),
            }
          : undefined,
      },
      include: { pricingTiers: true },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
