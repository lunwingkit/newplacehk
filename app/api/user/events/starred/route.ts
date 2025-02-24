import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized", message: "You have not logged in yet" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page")) || 1
  const limit = 10

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found", message: "User not found" }, { status: 404 })
    }

    const starredEvents = await prisma.starredEvents.findMany({
      where: { userId: user.id },
      skip: (page - 1) * limit,
      take: limit + 1,
      orderBy: { starredAt: "desc" },
      include: {
        event: true,
      },
    })

    const events = starredEvents.slice(0, limit).map((star) => star.event)
    const hasNextPage = starredEvents.length > limit

    return NextResponse.json({
      events,
      nextPage: hasNextPage ? page + 1 : null,
    })
  } catch (error) {
    console.error("Error fetching starred events:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

