import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const newsData = await request.json();
    const news = await prisma.news.upsert({
      where: { id: newsData.id || "" },
      update: newsData,
      create: newsData,
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upsert news" },
      { status: 500 }
    );
  }
}
