import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { TelegramBot } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    console.log("Sending announcement:", message?.substring(0, 50) + "...")

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ error: "Bot token missing" }, { status: 500 })
    }

    const bot = new TelegramBot(botToken)
    const users = await Database.getAllUsers()

    let sentCount = 0
    let failedCount = 0

    for (const user of users) {
      try {
        const result = await bot.sendMessage(user.id, `📢 <b>DUYURU</b>\n\n${message}`)

        if (result.ok) {
          sentCount++
        } else {
          failedCount++
          console.error(`Failed to send message to user ${user.id}:`, result.description)
        }

        // Rate limiting - wait 50ms between messages
        await new Promise((resolve) => setTimeout(resolve, 50))
      } catch (error) {
        failedCount++
        console.error(`Error sending message to user ${user.id}:`, error)
      }
    }

    return NextResponse.json({ sent: sentCount, failed: failedCount, total: users.length })
  } catch (error) {
    console.error("Error sending announcement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
