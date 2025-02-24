import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    console.log("hellotest userr");
    const userData = await request.json();
    console.log(userData);

    // 嘗試先查詢是否存在該 id 的記錄
    const existingUser = userData.id
      ? await prisma.user.findUnique({ where: { id: userData.id } })
      : null;

    const user = await prisma.user.upsert({
      where: { id: userData.id || "" },
      update: userData,
      create: userData,
    });

    const isUpdate = !!existingUser; // 如果先前查詢有結果，則是更新操作
    return NextResponse.json(
      {
        item: user,
        message: isUpdate ? "Update Success" : "Create Success",
        description: `You have successfully ${isUpdate ? "updated" : "created"} the data.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to upsert user", description: JSON.stringify(error) },
      { status: 500 }
    );
  }
}