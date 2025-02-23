import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("hello");
    const eventData = await request.json();
    console.log(eventData);
    const event = await prisma.event.upsert({
      where: { id: eventData.id || "" },
      update: eventData,
      create: eventData,
    });
    return NextResponse.json(event);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to upsert event", description: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
