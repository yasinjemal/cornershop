// ============================================
// Search API — lightweight autocomplete endpoint
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/search?q=term
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (q.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        imageUrl: true,
        category: { select: { name: true, slug: true } },
      },
      take: 8,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
