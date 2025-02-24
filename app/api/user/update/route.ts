import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
// import { getServerSession } from "next-auth"
import { auth } from "@/auth"

export async function POST(request: Request) {
  try {
    // const session = await getServerSession(auth)
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const data = await request.json()

    // Validate the data
    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Ensure the user can only update their own profile
    // if (data.email !== session.user.email) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { email: data.email },
      data: {
        name: data.name,
        age: data.age ? Number.parseInt(data.age) : null,
        gender: data.gender,
        interests: data.interests || [],
        introduction: data.introduction,
      },
    })

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

