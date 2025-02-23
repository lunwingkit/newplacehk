import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(request: Request, { params }: { params: { id: string; participantId: string } }) {
  try {
    const { participantId } = params
    await prisma.eventsSignedUpByUsers.delete({
      where: { id: participantId },
    })
    return NextResponse.json({ message: "Participant deleted successfully" })
  } catch (error) {
    console.error("Failed to delete participant:", error)
    return NextResponse.json({ error: "Failed to delete participant" }, { status: 500 })
  }
}

