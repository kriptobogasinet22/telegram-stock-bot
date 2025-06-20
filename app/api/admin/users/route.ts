import { NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    console.log("Getting all users")
    const users = await Database.getAllUsers()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
