// ============================================
// Users API — GET all / POST create
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users?email=xxx — find by email (single), or list all (admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Secure single-user lookup by email (for checkout)
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, role: true },
      });
      if (!user) {
        return NextResponse.json({ success: true, data: null });
      }
      return NextResponse.json({ success: true, data: user });
    }

    // Full user list (admin use only)
    const users = await prisma.user.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users — create a user
export async function POST(req: NextRequest) {
  try {
    const { name, email, role } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: { name, email, role: role || "RETAIL" },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error: unknown) {
    // Handle unique constraint violation  
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 409 }
      );
    }
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
