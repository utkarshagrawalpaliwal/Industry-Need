import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  landingPrice: z.number().nonnegative().optional(),
  mrp: z.number().positive().optional(),
  sellingPrice: z.number().positive().optional(),
  categoryId: z.string().min(1).optional(),
  specifications: z.string().optional(),
  inStock: z.boolean().optional(),
  imageUrl: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: parsed.data,
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
