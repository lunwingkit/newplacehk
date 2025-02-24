import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    console.log("hello");
    const newsData = await request.json();
    console.log(newsData);

    // 嘗試先查詢是否存在該 id 的記錄
    const existingNews = newsData.id
      ? await prisma.news.findUnique({ where: { id: newsData.id } })
      : null;

    const news = await prisma.news.upsert({
      where: { id: newsData.id || "" },
      update: newsData,
      create: newsData,
    });

    const isUpdate = !!existingNews; // 如果先前查詢有結果，則是更新操作
    return NextResponse.json(
      {
        item: news,
        message: isUpdate ? "Update Success" : "Create Success",
        description: `You have successfully ${isUpdate ? "updated" : "created"} the data.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to upsert news", description: JSON.stringify(error) },
      { status: 500 }
    );
  }
}