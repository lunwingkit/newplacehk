import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const eventId = params.id
  const userEmail = session.user.email

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { starredEvents: { where: { id: eventId } } },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isStarred = user.starredEvents.length > 0

    return NextResponse.json({ isStarred })
  } catch (error) {
    console.error("Error checking star status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  console.log('helo');
  console.log('helo');
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const eventId = params.id
  const userEmail = session.user.email

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { starredEvents: { where: { id: eventId } } },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const isCurrentlyStarred = user.starredEvents.length > 0

    if (isCurrentlyStarred) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          starredEvents: {
            disconnect: { id: eventId },
          },
        },
      })
      return NextResponse.json({ isStarred: false, message: "Event removed from favorites" })
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          starredEvents: {
            connect: { id: eventId },
          },
        },
      })
      return NextResponse.json({ isStarred: true, message: "Event added to favorites" })
    }
  } catch (error) {
    console.error("Error starring event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

