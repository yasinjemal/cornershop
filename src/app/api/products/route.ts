// ============================================
// Products API — GET all / POST create
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products?search=&sort=name|price|newest&category=&featured=true
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    const orderBy =
      sort === "name"
        ? { name: "asc" as const }
        : sort === "price"
          ? { basePrice: "asc" as const }
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
    if (featured === "true") {
      where.featured = true;
    }

    const products = await prisma.product.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        pricingTiers: { orderBy: { minQty: "asc" } },
        category: true,
      },
      orderBy,
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products — create a product with optional pricing tiers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, basePrice, imageUrl, pricingTiers, slug, stock, sku, featured, images, categoryId } = body;

    if (!name || !description || basePrice == null || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description,
        basePrice: parseFloat(basePrice),
        imageUrl,
        ...(stock != null && { stock: parseInt(stock) }),
        ...(sku && { sku }),
        ...(featured != null && { featured }),
        ...(images?.length && { images }),
        ...(categoryId && { categoryId }),
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

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
