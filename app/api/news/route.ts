export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      prisma.news.findMany({
        take: pageSize,
        skip: skip,
      }),
      prisma.news.count(),
    ]);

    return NextResponse.json({
      items,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
