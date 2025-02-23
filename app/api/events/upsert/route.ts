import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("hello");
    const eventData = await request.json();
    console.log(eventData);

    // 嘗試先查詢是否存在該 id 的記錄
    const existingEvent = eventData.id
      ? await prisma.event.findUnique({ where: { id: eventData.id } })
      : null;

    const event = await prisma.event.upsert({
      where: { id: eventData.id || "" },
      update: eventData,
      create: eventData,
    });

    const isUpdate = !!existingEvent; // 如果先前查詢有結果，則是更新操作
    return NextResponse.json(
      {
        item: event,
        message: isUpdate ? "Update Success" : "Create Success",
        description: `You have successfully ${isUpdate ? "updated" : "created"} the data.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to upsert event", description: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
