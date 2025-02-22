import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    const user = await prisma.user.upsert({
      where: { id: userData.id || "" },
      update: userData,
      create: userData,
    })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Failed to upsert user" }, { status: 500 })
  }
}

