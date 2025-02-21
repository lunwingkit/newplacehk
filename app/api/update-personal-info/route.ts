import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Randomly decide success or failure
  const isSuccess = Math.random() < 0.5

  if (isSuccess) {
    return NextResponse.json({ message: "Personal information updated successfully" })
  } else {
    return NextResponse.json({ message: "Failed to update personal information" }, { status: 500 })
  }
}

