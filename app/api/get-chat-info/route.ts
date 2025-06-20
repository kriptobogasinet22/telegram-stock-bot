import { type NextRequest, NextResponse } from "next/server"
import { TelegramBot } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const { chatUsername } = await request.json()
    console.log("Getting chat info for:", chatUsername)

    if (!chatUsername) {
      return NextResponse.json({ error: "Chat username required" }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ error: "Bot token missing" }, { status: 500 })
    }

    const bot = new TelegramBot(botToken)
    const response = await bot.getChat(chatUsername.startsWith("@") ? chatUsername : `@${chatUsername}`)

    if (response.ok) {
      return NextResponse.json({
        id: response.result.id,
        title: response.result.title,
        username: response.result.username,
        type: response.result.type,
      })
    } else {
      return NextResponse.json({ error: response.description }, { status: 400 })
    }
  } catch (error) {
    console.error("Get chat info error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
