import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    if (quote.status !== "accepted") {
      return NextResponse.json(
        { error: "Only accepted quotes can be converted to orders" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          quoteId: quote.id,
          customerName: quote.name,
          customerPhone: quote.phone,
          company: quote.company,
          address: quote.address ?? "",
          subtotal: quote.subtotal,
          gst: quote.gst,
          total: quote.total,
          status: "confirmed",
          paymentStatus: "paid",
          items: {
            create: quote.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.sellingPrice,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      const updatedQuote = await tx.quote.update({
        where: { id: quote.id },
        data: { status: "converted" },
        include: { items: true },
      });

      return { quote: updatedQuote, order };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("POST /api/quotes/[id]/convert error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
