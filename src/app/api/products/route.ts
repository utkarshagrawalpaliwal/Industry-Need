import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const createProductSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().min(1),
  landingPrice: z.number().nonnegative(),
  mrp: z.number().positive(),
  sellingPrice: z.number().positive(),
  categoryId: z.string().min(1),
  specifications: z.string().optional(),
  inStock: z.boolean().optional(),
  imageUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = slugify(`${data.brand}-${data.name}`);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        brand: data.brand,
        sku: data.sku,
        description: data.description,
        landingPrice: data.landingPrice,
        mrp: data.mrp,
        sellingPrice: data.sellingPrice,
        categoryId: data.categoryId,
        specifications: data.specifications,
        inStock: data.inStock ?? true,
        imageUrl: data.imageUrl,
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      include: { category: true },
    });

    return NextResponse.json(products);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
