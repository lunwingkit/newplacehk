import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "10", 10)
  const skip = (page - 1) * pageSize

  try {
    const { id } = params
    const [interestedUsers, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: {
          interests: {
            has: id,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        skip,
        take: pageSize,
      }),
      prisma.user.count({
        where: {
          interests: {
            has: id,
          },
        },
      }),
    ])

    return NextResponse.json({
      items: interestedUsers,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
    })
  } catch (error) {
    console.error("Failed to fetch interested users:", error)
    return NextResponse.json({ error: "Failed to fetch interested users" }, { status: 500 })
  }
}

