import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQuoteNumber } from "@/lib/utils";
import { z } from "zod";

const quoteItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  brand: z.string().min(1),
  sku: z.string().min(1),
  landingPrice: z.number().nonnegative(),
  mrp: z.number().nonnegative(),
  sellingPrice: z.number().positive(),
  quantity: z.number().int().positive(),
});

const createQuoteSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  company: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(quoteItemSchema).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createQuoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, phone, company, address, notes, items } = parsed.data;

    const subtotal = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
    const gst = parseFloat((subtotal * 0.18).toFixed(2));
    const total = parseFloat((subtotal + gst).toFixed(2));

    const quote = await prisma.quote.create({
      data: {
        quoteNumber: generateQuoteNumber(),
        name,
        phone,
        company,
        address,
        notes,
        subtotal,
        gst,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            brand: item.brand,
            sku: item.sku,
            landingPrice: item.landingPrice,
            mrp: item.mrp,
            sellingPrice: item.sellingPrice,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("POST /api/quotes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("GET /api/quotes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
