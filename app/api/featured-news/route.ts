import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const newsItems = await prisma.news.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 3,
      select: {
        id: true,
        title: true,
        publishedAt: true,
        image: true,
        slug: true,
        summary: true,
        tags: true,
      },
    })

    return NextResponse.json(newsItems)
  } catch (error) {
    console.error("Error fetching news items:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

