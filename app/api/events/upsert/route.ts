import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const eventData = await request.json();
    const event = await prisma.event.upsert({
      where: { id: eventData.id || "" },
      update: eventData,
      create: eventData,
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upsert event" },
      { status: 500 }
    );
  }
}
