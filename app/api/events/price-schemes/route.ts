import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "10", 10)
  const skip = (page - 1) * pageSize

  try {
    const { id } = params
    const [priceSchemes, totalCount] = await Promise.all([
      prisma.priceScheme.findMany({
        where: { eventId: id },
        skip,
        take: pageSize,
      }),
      prisma.priceScheme.count({ where: { eventId: id } }),
    ])

    return NextResponse.json({
      items: priceSchemes,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
    })
  } catch (error) {
    console.error("Failed to fetch price schemes:", error)
    return NextResponse.json({ error: "Failed to fetch price schemes" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name, description, price } = await request.json()

    const priceScheme = await prisma.priceScheme.create({
      data: {
        name,
        description,
        price: Number(price),
        event: { connect: { id } },
      },
    })

    return NextResponse.json(priceScheme)
  } catch (error) {
    console.error("Failed to add price scheme:", error)
    return NextResponse.json({ error: "Failed to add price scheme" }, { status: 500 })
  }
}

