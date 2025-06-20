import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

export async function GET() {
  try {
    console.log("Getting all settings")

    // Tüm ayarları al
    const settings: Record<string, string> = {}

    // Ana ayarları al
    const mainChannelLink = await Database.getSetting("main_channel_link")
    const mainChannelId = await Database.getSetting("main_channel_id")
    const inviteLink = await Database.getSetting("invite_link")

    if (mainChannelLink) settings.main_channel_link = mainChannelLink
    if (mainChannelId) settings.main_channel_id = mainChannelId
    if (inviteLink) settings.invite_link = inviteLink

    return NextResponse.json({
      status: "success",
      settings,
    })
  } catch (error) {
    console.error("Error getting settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Updating settings:", body)

    const updates: Record<string, boolean> = {}

    // Ana ayarları güncelle
    if (body.main_channel_link !== undefined) {
      const success = await Database.updateSetting("main_channel_link", body.main_channel_link)
      updates.main_channel_link = success
    }

    if (body.main_channel_id !== undefined) {
      const success = await Database.updateSetting("main_channel_id", body.main_channel_id)
      updates.main_channel_id = success
    }

    if (body.invite_link !== undefined) {
      const success = await Database.updateSetting("invite_link", body.invite_link)
      updates.invite_link = success
    }

    return NextResponse.json({
      status: "success",
      updates,
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
