import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { EventStatus } from "@prisma/client"

export async function GET() {
  try {
    const featuredEvents = await prisma.event.findMany({
      where: {
        OR: [{ status: EventStatus.UPCOMING }, { status: EventStatus.PREPARING }],
      },
      orderBy: {
        startDate: "asc",
      },
      take: 4,
      select: {
        id: true,
        title: true,
        image: true,
        startDate: true,
        location: true,
        description: true,
      },
    })
    return NextResponse.json(featuredEvents)
  } catch (error) {
    console.error("Error fetching 近期活動:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

