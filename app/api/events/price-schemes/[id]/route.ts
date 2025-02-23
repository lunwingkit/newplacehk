import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(request: Request, { params }: { params: { id: string; schemeId: string } }) {
  try {
    const { schemeId } = params
    await prisma.priceScheme.delete({
      where: { id: schemeId },
    })
    return NextResponse.json({ message: "Price scheme deleted successfully" })
  } catch (error) {
    console.error("Failed to delete price scheme:", error)
    return NextResponse.json({ error: "Failed to delete price scheme" }, { status: 500 })
  }
}

