import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { EventStatus, SignUpStatus } from "@prisma/client";

export async function POST(request: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    console.log('wtf')
    const session = await auth();

    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized", message: "You have not yet logged in yet." }, { status: 401 });
    }

    const { eventId } = params;

    // Fetch the event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { signedUpUsers: true },
    });

    // Check if the event exists
    if (!event) {
      return NextResponse.json({ error: "Event not found", message: "You have not yet logged in yet." }, { status: 404 });
    }

    // Check if the event is open for sign-ups
    if (event.status !== EventStatus.UPCOMING) {
      return NextResponse.json({ error: "Event is not open for sign-ups", message: "You have not yet logged in yet." }, { status: 400 });
    }

    // Check if the event is at full capacity
    if (event.signedUpUsers.length >= event.capacity) {
      return NextResponse.json({ error: "Event is at full capacity", message: "You have not yet logged in yet." }, { status: 400 });
    }

    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    // Check if the user exists
    if (!user) {
      return NextResponse.json({ error: "User not found", message: "You have not yet logged in yet." }, { status: 404 });
    }

    // Check if the user is already signed up for the event
    const existingSignUp = await prisma.eventsSignedUpByUsers.findFirst({
      where: {
        userId: user.id,
        eventId: eventId,
      },
    });

    if (existingSignUp) {
      return NextResponse.json({ error: "User is already signed up for this event", message: "You have not yet logged in yet." }, { status: 400 });
    }

    // Create a new EventsSignedUpByUsers record
    const newSignUp = await prisma.eventsSignedUpByUsers.create({
      data: {
        userId: user.id,
        eventId: eventId,
        priceSchemeId: "default-price-scheme-id", // Replace with the actual price scheme ID if applicable
        status: SignUpStatus.PENDING, // Default status
      },
    });

    return NextResponse.json({
      message: "Successfully signed up for the event",
      event: {
        id: event.id,
        title: event.title,
        signedUpUsers: event.signedUpUsers.length + 1, // Increment the count
      },
      signUp: newSignUp,
    });
  } catch (error) {
    console.error("Error signing up for event:", error);
    return NextResponse.json({ error: "Internal Server Error", message: "You have not yet logged in yet." }, { status: 500 });
  }
}