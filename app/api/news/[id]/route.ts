import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.news.delete({
      where: { id },
    });
    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const article = await prisma.news.findUnique({
      where: { id },
    })

    if (!article) {
      return NextResponse.json({ error: "News article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching news article:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

