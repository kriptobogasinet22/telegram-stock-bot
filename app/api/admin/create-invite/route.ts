import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { TelegramBot } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const { chatId } = await request.json()
    console.log("Creating invite link for chat:", chatId)

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ error: "Bot token missing" }, { status: 500 })
    }

    const bot = new TelegramBot(botToken)

    // Önce chat'in var olup olmadığını kontrol et
    const getChatResponse = await bot.getChat(chatId)

    if (!getChatResponse.ok) {
      return NextResponse.json(
        {
          error: `Kanal bulunamadı: ${getChatResponse.description}. Bot'un kanala admin olarak eklendiğinden emin olun.`,
        },
        { status: 400 },
      )
    }

    // Davet linki oluştur
    const response = await bot.createChatInviteLink(chatId, "Bot Kullanıcıları")

    if (response.ok) {
      // Davet linkini database'e kaydet
      await Database.updateSetting("invite_link", response.result.invite_link)

      return NextResponse.json({
        invite_link: response.result.invite_link,
        expire_date: response.result.expire_date,
      })
    } else {
      return NextResponse.json(
        {
          error: `Davet linki oluşturulamadı: ${response.description}`,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Create invite link error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
