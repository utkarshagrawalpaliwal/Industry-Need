import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PRICING_BREAKDOWN } from "@/lib/constants";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "default" } });

    if (!settings) {
      return NextResponse.json({ pricingBreakdown: DEFAULT_PRICING_BREAKDOWN });
    }

    return NextResponse.json(settings.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { pricingBreakdown, whatsappPhone, displayPhone } = body;

    if (!Array.isArray(pricingBreakdown) || pricingBreakdown.length === 0) {
      return NextResponse.json({ error: "Invalid pricing breakdown" }, { status: 400 });
    }

    const total = pricingBreakdown.reduce((s: number, b: { percent: number }) => s + b.percent, 0);
    if (Math.abs(total - 1.0) > 0.01) {
      return NextResponse.json(
        { error: `Percentages must sum to 100%. Current total: ${Math.round(total * 100)}%` },
        { status: 400 }
      );
    }

    const settingsData: Record<string, unknown> = { pricingBreakdown };
    if (whatsappPhone) settingsData.whatsappPhone = whatsappPhone;
    if (displayPhone) settingsData.displayPhone = displayPhone;

    const jsonData = settingsData as Prisma.InputJsonValue;

    const settings = await prisma.settings.upsert({
      where: { id: "default" },
      update: { data: jsonData },
      create: { id: "default", data: jsonData },
    });

    return NextResponse.json(settings.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
