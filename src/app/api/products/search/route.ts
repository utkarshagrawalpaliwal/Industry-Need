import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

    if (q.length < 2) {
      return NextResponse.json([]);
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { brand: { contains: q, mode: "insensitive" } },
          { sku: { contains: q, mode: "insensitive" } },
        ],
        inStock: true,
      },
      select: {
        id: true,
        name: true,
        brand: true,
        sku: true,
        mrp: true,
        sellingPrice: true,
      },
      take: 20,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Product search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
