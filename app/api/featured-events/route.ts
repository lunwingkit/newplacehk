import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { EventStatus } from "@prisma/client"

export async function GET() {
  try {
    console.log('help me debug')
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

    console.log(featuredEvents);
    return NextResponse.json(featuredEvents)
  } catch (error) {
    console.error("Error fetching featured events:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

