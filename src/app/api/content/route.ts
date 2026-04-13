import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all content blocks or a specific one via ?key=hero
export async function GET(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get("key");

    if (key) {
      const content = await prisma.content.findUnique({ where: { id: key } });
      if (!content) return NextResponse.json(null);
      return NextResponse.json(content.data);
    }

    const all = await prisma.content.findMany();
    const map: Record<string, unknown> = {};
    for (const c of all) {
      map[c.id] = c.data;
    }
    return NextResponse.json(map);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("GET /api/content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT to upsert a content block: { key: "hero", data: {...} }
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, data } = body;

    if (!key || !data) {
      return NextResponse.json({ error: "key and data are required" }, { status: 400 });
    }

    const content = await prisma.content.upsert({
      where: { id: key },
      update: { data },
      create: { id: key, data },
    });

    return NextResponse.json(content.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("PUT /api/content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
