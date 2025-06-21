import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { TelegramBot, type TelegramUpdate } from "@/lib/telegram"
import { BotCommands } from "@/lib/bot-commands"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Webhook received!")

    const update: TelegramUpdate = await request.json()
    console.log(
      "📨 Update type:",
      update.message
        ? "message"
        : update.callback_query
          ? "callback_query"
          : update.chat_join_request
            ? "chat_join_request"
            : update.chat_member
              ? "chat_member"
              : "unknown",
    )

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error("❌ Bot token missing!")
      return NextResponse.json({ error: "Bot token missing" }, { status: 500 })
    }

    const bot = new TelegramBot(botToken)
    const commands = new BotCommands(bot)

    // Handle join requests
    if (update.chat_join_request) {
      const { chat_join_request } = update
      const userId = chat_join_request.from.id
      const chatId = chat_join_request.chat.id

      console.log(`📥 Join request from user ${userId} for chat ${chatId}`)

      // Join request'i kaydet
      await Database.createJoinRequest({
        user_id: userId,
        chat_id: chatId,
        username: chat_join_request.from.username,
        first_name: chat_join_request.from.first_name,
        last_name: chat_join_request.from.last_name,
        bio: chat_join_request.bio,
      })

      // Kullanıcıyı aktif et - istek attığı anda botu kullanabilir
      await Database.updateUserMembership(userId, true)

      try {
        const welcomeMessage = `✅ <b>Katılma isteğiniz alındı!</b>

Artık @borsaozelderinlik_bot'u kullanabilirsiniz!

🚀 <b>Başlamak için:</b>
• /start - Ana menü
• THYAO - Hisse analizi

<b>Popüler Komutlar:</b>
• /derinlik THYAO
• /temel AKBNK  
• /teknik GARAN`

        await bot.sendMessage(userId, welcomeMessage)
      } catch (error) {
        console.error(`Failed to send welcome message to ${userId}:`, error)
      }

      return NextResponse.json({ ok: true })
    }

    // Handle callback queries
    if (update.callback_query) {
      const { callback_query } = update
      const userId = callback_query.from.id
      const chatId = callback_query.message?.chat.id!
      const data = callback_query.data!

      console.log(`🔄 Callback query from user ${userId}: ${data}`)

      await bot.answerCallbackQuery(callback_query.id)

      if (data === "check_membership") {
        await commands.checkMembership(userId, chatId)
      } else if (data.startsWith("derinlik_")) {
        const stockCode = data.replace("derinlik_", "")
        await commands.getDepthAnalysis(stockCode, chatId)
      } else if (data.startsWith("teorik_")) {
        const stockCode = data.replace("teorik_", "")
        await commands.getTheoreticalAnalysis(stockCode, chatId)
      } else if (data.startsWith("temel_")) {
        const stockCode = data.replace("temel_", "")
        await commands.getFundamentalAnalysis(stockCode, chatId)
      } else if (data.startsWith("teknik_")) {
        const stockCode = data.replace("teknik_", "")
        await commands.getTechnicalAnalysis(stockCode, chatId)
      } else if (data.startsWith("yenile_")) {
        const stockCode = data.replace("yenile_", "")
        await commands.handleStockCode(userId, chatId, stockCode)
      }

      return NextResponse.json({ ok: true })
    }

    // Handle messages
    if (update.message) {
      const { message } = update
      const userId = message.from?.id!
      const chatId = message.chat.id
      const text = message.text || ""

      console.log(`💬 Message from user ${userId}: ${text}`)

      // /start dışındaki komutlar için üyelik kontrolü
      if (!text.startsWith("/start")) {
        const user = await Database.getUser(userId)
        const mainChannelId = await Database.getSetting("main_channel_id")
        const joinRequest = mainChannelId ? await Database.getJoinRequest(userId, Number.parseInt(mainChannelId)) : null

        if (!user?.is_member && !joinRequest) {
          await commands.handleStart(userId, chatId, message.from!)
          return NextResponse.json({ ok: true })
        }

        if (!user?.is_member && joinRequest) {
          await Database.updateUserMembership(userId, true)
        }
      }

      // Handle commands
      if (text.startsWith("/start")) {
        await commands.handleStart(userId, chatId, message.from!)
      } else if (text.startsWith("/derinlik ")) {
        const stockCode = text.replace("/derinlik ", "").toUpperCase()
        await commands.getDepthAnalysis(stockCode, chatId)
      } else if (text.startsWith("/teorik ")) {
        const stockCode = text.replace("/teorik ", "").toUpperCase()
        await commands.getTheoreticalAnalysis(stockCode, chatId)
      } else if (text.startsWith("/temel ")) {
        const stockCode = text.replace("/temel ", "").toUpperCase()
        await commands.getFundamentalAnalysis(stockCode, chatId)
      } else if (text.startsWith("/teknik ")) {
        const stockCode = text.replace("/teknik ", "").toUpperCase()
        await commands.getTechnicalAnalysis(stockCode, chatId)
      } else if (text.match(/^[A-Z0-9]{2,6}$/)) {
        // Stock code pattern
        await commands.handleStockCode(userId, chatId, text)
      } else {
        const helpMessage = `🤖 <b>@borsaozelderinlik_bot - Komut Listesi</b>

🔍 <b>Analiz Komutları:</b>
• /derinlik HISSE – Derinlik analizi
• /teorik HISSE – Teorik analiz
• /temel HISSE – Temel analiz
• /teknik HISSE – Teknik analiz

💡 <b>Kullanım:</b> Sadece hisse kodu gönderin!
Örnek: <code>THYAO</code>`

        await bot.sendMessage(chatId, helpMessage)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "✅ @borsaozelderinlik_bot webhook working!",
    timestamp: new Date().toISOString(),
    botToken: process.env.TELEGRAM_BOT_TOKEN ? "✅ Token Set" : "❌ Token Missing",
    supabase: process.env.SUPABASE_URL ? "✅ Supabase Set" : "❌ Supabase Missing",
  })
}
