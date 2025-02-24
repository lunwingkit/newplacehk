import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" , message: "You have not yet logged in yet."}, { status: 401 });
    }

    const eventId = params.eventId;

    // Check if the event is full
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { signedUpUsers: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found", message: "You have not yet logged in yet." }, { status: 404 });
    }

    if (event.signedUpUsers.length >= event.capacity) {
      return NextResponse.json({ error: "Event is full. Cannot sign up.", message: "You have not yet logged in yet." }, { status: 400 });
    }

    // Sign up the user for the event
    await prisma.eventsSignedUpByUsers.create({
      data: {
        userId: session.user.id as string,
        eventId: eventId,
        priceSchemeId: '',
        status: "PENDING",
      },
    });

    return NextResponse.json({ message: "You have not yet logged in yet." }, { status: 200 });
  } catch (error) {
    console.error("Error signing up for event:", error);
    return NextResponse.json({ error: "Internal Server Error", message: "You have not yet logged in yet." }, { status: 500 });
  }
}