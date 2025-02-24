export const dynamic = "force-dynamic";

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth(); //getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        signedUpEvents: {
          select: { id: true },
        },
        starredEvents: {
          select: { id: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      signedUpEvents: user.signedUpEvents.map((event) => event.id),
      starredEvents: user.starredEvents.map((event) => event.id),
    })
  } catch (error) {
    console.error("Error fetching user events:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

