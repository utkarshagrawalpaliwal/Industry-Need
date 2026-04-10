import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");

    if (!orderNumber && !phone) {
      return NextResponse.json(
        { error: "Provide orderNumber or phone query param" },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {};

    if (orderNumber) {
      where.orderNumber = orderNumber;
    } else if (phone) {
      where.customerPhone = phone;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders/track error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
