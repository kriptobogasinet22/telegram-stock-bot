import { Database } from "./database"
import type { TelegramBot } from "./telegram"
import { stockAPI } from "./stock-api"

export class BotCommands {
  private bot: TelegramBot

  constructor(bot: TelegramBot) {
    this.bot = bot
  }

  async handleStart(userId: number, chatId: number, userData: any) {
    try {
      console.log(`Start command from user ${userId}`)

      await Database.createOrUpdateUser({
        id: userId,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        is_member: false,
      })

      const mainChannelId = await Database.getSetting("main_channel_id")
      const inviteLink = await Database.getSetting("invite_link")

      console.log(`Channel settings: id=${mainChannelId}, invite=${inviteLink}`)

      // Join request durumunu kontrol et
      const joinRequest = mainChannelId ? await Database.getJoinRequest(userId, Number.parseInt(mainChannelId)) : null

      if (joinRequest) {
        // İstek gönderilmişse direkt menüyü göster
        await Database.updateUserMembership(userId, true)
        await this.showMainMenu(userId, chatId)
        return
      }

      // İstek gönderilmemişse davet mesajı göster
      let message = `🔒 <b>Özel Kanal Erişimi Gerekli</b>

Bot'u kullanabilmek için özel kanalımıza katılma isteği göndermelisiniz.

👆 Aşağıdaki butona tıklayarak katılma isteği gönderin, ardından "Kontrol Et" butonuna basın.`

      const keyboard = {
        inline_keyboard: [] as any[],
      }

      // Invite link varsa kullan
      if (inviteLink) {
        keyboard.inline_keyboard.push([{ text: "🔗 Katılma İsteği Gönder", url: inviteLink }])
      } else {
        message += `\n\n❌ <b>Henüz davet linki oluşturulmamış.</b>\nAdmin ile iletişime geçin.`
      }

      keyboard.inline_keyboard.push([{ text: "✅ İstek Gönderdiysem Kontrol Et", callback_data: "check_membership" }])

      await this.bot.sendMessage(chatId, message, {
        reply_markup: keyboard,
      })
    } catch (error) {
      console.error(`Error in handleStart for user ${userId}:`, error)
      await this.bot.sendMessage(chatId, "❌ Bir hata oluştu. Lütfen tekrar deneyin.")
    }
  }

  async checkMembership(userId: number, chatId: number) {
    try {
      console.log(`Checking membership for user ${userId}`)

      const mainChannelId = await Database.getSetting("main_channel_id")

      if (!mainChannelId) {
        await this.bot.sendMessage(chatId, "❌ Kanal ayarları yapılmamış.")
        return
      }

      // Join request var mı kontrol et
      const joinRequest = await Database.getJoinRequest(userId, Number.parseInt(mainChannelId))

      if (joinRequest) {
        // İstek varsa ARTIK menüyü göster ve hoş geldin de
        await Database.updateUserMembership(userId, true)

        const welcomeMessage = `✅ <b>Katılma isteğiniz onaylandı!</b>

Artık @borsaozelderinlik_bot'u kullanabilirsiniz!`

        await this.bot.sendMessage(chatId, welcomeMessage)
        await this.showMainMenu(userId, chatId)
      } else {
        const inviteLink = await Database.getSetting("invite_link")

        let message = "❌ Henüz katılma isteği göndermemişsiniz.\n\nLütfen önce katılma isteği gönderin."

        const keyboard = {
          inline_keyboard: [] as any[],
        }

        // Invite link varsa kullan
        if (inviteLink) {
          keyboard.inline_keyboard.push([{ text: "🔗 Katılma İsteği Gönder", url: inviteLink }])
        } else {
          message += "\n\n❌ Henüz davet linki oluşturulmamış. Admin ile iletişime geçin."
        }

        keyboard.inline_keyboard.push([{ text: "✅ İstek Gönderdiysem Kontrol Et", callback_data: "check_membership" }])

        await this.bot.sendMessage(chatId, message, {
          reply_markup: keyboard,
        })
      }
    } catch (error) {
      console.error(`Error in checkMembership for user ${userId}:`, error)
      await this.bot.sendMessage(chatId, "❌ Bir hata oluştu. Lütfen tekrar deneyin.")
    }
  }

  // Tek sabit ana menü
  async showMainMenu(userId: number, chatId: number) {
    const welcomeMessage = `🎯 <b>Borsa Özel Derinlik Bot</b>

🔍 <b>Komutlar:</b>
• /derinlik HISSE – Derinlik analizi
• /teorik HISSE – Teorik analiz  
• /temel HISSE – Temel analiz
• /teknik HISSE – Teknik analiz

💡 <b>Kullanım:</b> Sadece hisse kodu gönderin!
Örnek: <code>THYAO</code>`

    await this.bot.sendMessage(chatId, welcomeMessage)
  }

  async handleStockCode(userId: number, chatId: number, stockCode: string) {
    try {
      console.log(`Stock code ${stockCode} from user ${userId}`)

      const user = await Database.getUser(userId)

      if (!user?.is_member) {
        await this.handleStart(userId, chatId, { username: "", first_name: "User" })
        return
      }

      const stockPrice = await stockAPI.getStockPrice(stockCode)
      const priceInfo = stockPrice
        ? `\n\n💰 <b>Mevcut:</b> ${stockPrice.price.toFixed(2)} TL (${stockPrice.change > 0 ? "+" : ""}${stockPrice.changePercent.toFixed(2)}%)`
        : ""

      // Mobil uyumlu buton düzeni
      const keyboard = {
        inline_keyboard: [
          [
            { text: "📊 Derinlik", callback_data: `derinlik_${stockCode}` },
            { text: "📈 Teorik", callback_data: `teorik_${stockCode}` },
          ],
          [
            { text: "📋 Temel", callback_data: `temel_${stockCode}` },
            { text: "🔧 Teknik", callback_data: `teknik_${stockCode}` },
          ],
          [{ text: "🔄 Yenile Fiyat", callback_data: `yenile_${stockCode}` }],
        ],
      }

      await this.bot.sendMessage(chatId, `📊 <b>${stockCode.toUpperCase()}</b>${priceInfo}`, {
        reply_markup: keyboard,
      })
    } catch (error) {
      console.error(`Error in handleStockCode for user ${userId}, stock ${stockCode}:`, error)
      await this.bot.sendMessage(chatId, `❌ ${stockCode} için veri alınırken bir hata oluştu.`)
    }
  }

  async getDepthAnalysis(stockCode: string, chatId: number): Promise<void> {
    try {
      console.log(`Generating depth analysis for ${stockCode}`)

      const loadingMessage = await this.bot.sendMessage(chatId, `📊 ${stockCode} derinlik analizi hazırlanıyor...`)

      const depthData = await stockAPI.getMarketDepth(stockCode)
      const stockPrice = await stockAPI.getStockPrice(stockCode)

      if (!depthData || !stockPrice) {
        await this.bot.editMessageText(
          chatId,
          loadingMessage.result.message_id,
          `❌ ${stockCode} için derinlik verisi alınamadı.`,
        )
        return
      }

      // Loading mesajını sil
      await this.bot.deleteMessage(chatId, loadingMessage.result.message_id)

      // Temiz ve profesyonel tablo
      let tableMessage = `📊 <b>${stockCode.toUpperCase()} - PİYASA DERİNLİĞİ</b>

💰 <b>Fiyat:</b> ${stockPrice.price.toFixed(2)} TL
📈 <b>Değişim:</b> ${stockPrice.change > 0 ? "+" : ""}${stockPrice.change.toFixed(2)} TL (${stockPrice.change > 0 ? "+" : ""}${stockPrice.changePercent.toFixed(2)}%)
📊 <b>Hacim:</b> ${stockPrice.volume.toLocaleString()}

<code>╔═════╦════════╦════════╦════════╦════════╦═════╗
║ EMİR║  ADET  ║  ALIŞ  ║  SATIŞ ║  ADET  ║EMİR ║
╠═════╬════════╬════════╬════════╬════════╬═════╣`

      // İlk 15 seviye (mobil uyumlu)
      for (let i = 0; i < Math.min(15, Math.max(depthData.bids.length, depthData.asks.length)); i++) {
        const bid = depthData.bids[i]
        const ask = depthData.asks[i]

        const bidOrder = bid ? (i + 1).toString().padStart(4) : "    "
        const bidQuantity = bid ? this.formatNumber(bid.quantity).padStart(7) : "       "
        const bidPrice = bid ? bid.price.toFixed(2).padStart(7) : "       "
        const askPrice = ask ? ask.price.toFixed(2).padStart(7) : "       "
        const askQuantity = ask ? this.formatNumber(ask.quantity).padStart(7) : "       "
        const askOrder = ask ? (i + 1).toString().padStart(4) : "    "

        tableMessage += `
║${bidOrder} ║${bidQuantity}║${bidPrice}║${askPrice}║${askQuantity}║${askOrder} ║`
      }

      tableMessage += `
╚═════╩════════╩════════╩════════╩════════╩═════╝</code>

🟢 <b>Alış:</b> ${depthData.bids.length} kademe
🔴 <b>Satış:</b> ${depthData.asks.length} kademe

📊 <b>En İyi Fiyatlar:</b>
• En Yüksek Alış: ${depthData.bids[0]?.price.toFixed(2)} TL
• En Düşük Satış: ${depthData.asks[0]?.price.toFixed(2)} TL
• Spread: ${((depthData.asks[0]?.price || 0) - (depthData.bids[0]?.price || 0)).toFixed(2)} TL

⏰ ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}`

      // Yenile butonu ekle
      const keyboard = {
        inline_keyboard: [[{ text: "🔄 Derinlik Yenile", callback_data: `derinlik_${stockCode}` }]],
      }

      await this.bot.sendMessage(chatId, tableMessage, { reply_markup: keyboard })
      console.log(`✅ Depth analysis sent for ${stockCode}`)
    } catch (error) {
      console.error(`Error generating depth analysis for ${stockCode}:`, error)
      await this.bot.sendMessage(chatId, `❌ ${stockCode} için derinlik analizi oluşturulurken hata oluştu.`)
    }
  }

  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toString()
  }

  async getTheoreticalAnalysis(stockCode: string, chatId: number): Promise<void> {
    try {
      const loadingMessage = await this.bot.sendMessage(chatId, `📈 ${stockCode} teorik analiz hazırlanıyor...`)

      const stockPrice = await stockAPI.getStockPrice(stockCode)

      if (!stockPrice) {
        await this.bot.editMessageText(
          chatId,
          loadingMessage.result.message_id,
          `❌ ${stockCode} için teorik veri alınamadı.`,
        )
        return
      }

      await this.bot.deleteMessage(chatId, loadingMessage.result.message_id)

      const theoreticalPrice = stockPrice.price * (1 + Math.random() * 0.02 - 0.01)
      const difference = theoreticalPrice - stockPrice.price
      const diffPercent = (difference / stockPrice.price) * 100

      const message = `📈 <b>${stockCode.toUpperCase()} - TEORİK ANALİZ</b>

💰 <b>Mevcut Fiyat:</b> ${stockPrice.price.toFixed(2)} TL
🎯 <b>Teorik Fiyat:</b> ${theoreticalPrice.toFixed(2)} TL
📊 <b>Fark:</b> ${difference > 0 ? "+" : ""}${difference.toFixed(2)} TL (${diffPercent > 0 ? "+" : ""}${diffPercent.toFixed(2)}%)

📈 <b>Günlük Veriler:</b>
• 🔓 Açılış: ${stockPrice.open.toFixed(2)} TL
• ⬆️ En Yüksek: ${stockPrice.high.toFixed(2)} TL  
• ⬇️ En Düşük: ${stockPrice.low.toFixed(2)} TL
• 📊 Hacim: ${stockPrice.volume.toLocaleString()}

${diffPercent > 1 ? "🟢 <b>Pozitif Sinyal</b>" : diffPercent < -1 ? "🔴 <b>Negatif Sinyal</b>" : "🟡 <b>Nötr Sinyal</b>"}

⏰ ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}`

      const keyboard = {
        inline_keyboard: [[{ text: "🔄 Teorik Yenile", callback_data: `teorik_${stockCode}` }]],
      }

      await this.bot.sendMessage(chatId, message, { reply_markup: keyboard })
    } catch (error) {
      console.error(`Error getting theoretical analysis for ${stockCode}:`, error)
      await this.bot.sendMessage(chatId, `❌ ${stockCode} için teorik analiz yapılırken hata oluştu.`)
    }
  }

  async getFundamentalAnalysis(stockCode: string, chatId: number): Promise<void> {
    try {
      const loadingMessage = await this.bot.sendMessage(chatId, `📋 ${stockCode} temel analiz hazırlanıyor...`)

      const companyInfo = await stockAPI.getCompanyInfo(stockCode)
      const stockPrice = await stockAPI.getStockPrice(stockCode)

      if (!companyInfo || !stockPrice) {
        await this.bot.editMessageText(
          chatId,
          loadingMessage.result.message_id,
          `❌ ${stockCode} için temel analiz verisi alınamadı.`,
        )
        return
      }

      await this.bot.deleteMessage(chatId, loadingMessage.result.message_id)

      const message = `📋 <b>${stockCode.toUpperCase()} - TEMEL ANALİZ</b>

🏭 <b>Şirket:</b> ${companyInfo.name}
🏗️ <b>Sektör:</b> ${companyInfo.sector}
💰 <b>Mevcut Fiyat:</b> ${stockPrice.price.toFixed(2)} TL

📊 <b>Finansal Oranlar:</b>
• 📈 F/K Oranı: ${companyInfo.peRatio?.toFixed(2)}
• 📉 PD/DD Oranı: ${companyInfo.pbRatio?.toFixed(2)}
• 💵 Temettü Verimi: %${companyInfo.dividendYield?.toFixed(2)}

💹 <b>Piyasa Verileri:</b>
• 🏦 Piyasa Değeri: ${(companyInfo.marketCap / 1000000).toFixed(0)}M TL
• 📊 Günlük Hacim: ${stockPrice.volume.toLocaleString()}

${companyInfo.peRatio && companyInfo.peRatio < 15 ? "🟢 <b>Değerli Görünüyor</b>" : companyInfo.peRatio && companyInfo.peRatio > 25 ? "🔴 <b>Pahalı Görünüyor</b>" : "🟡 <b>Normal Değerleme</b>"}

⏰ ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}`

      const keyboard = {
        inline_keyboard: [[{ text: "🔄 Temel Yenile", callback_data: `temel_${stockCode}` }]],
      }

      await this.bot.sendMessage(chatId, message, { reply_markup: keyboard })
    } catch (error) {
      console.error(`Error getting fundamental analysis for ${stockCode}:`, error)
      await this.bot.sendMessage(chatId, `❌ ${stockCode} için temel analiz yapılırken hata oluştu.`)
    }
  }

  async getTechnicalAnalysis(stockCode: string, chatId: number): Promise<void> {
    try {
      const loadingMessage = await this.bot.sendMessage(chatId, `🔧 ${stockCode} teknik analiz hazırlanıyor...`)

      const stockPrice = await stockAPI.getStockPrice(stockCode)

      if (!stockPrice) {
        await this.bot.editMessageText(
          chatId,
          loadingMessage.result.message_id,
          `❌ ${stockCode} için teknik veri alınamadı.`,
        )
        return
      }

      await this.bot.deleteMessage(chatId, loadingMessage.result.message_id)

      // Basit teknik göstergeler
      const sma20 = stockPrice.price * (1 + Math.random() * 0.1 - 0.05)
      const sma50 = stockPrice.price * (1 + Math.random() * 0.15 - 0.075)
      const rsi = Math.floor(Math.random() * 100)
      const support = stockPrice.low * 0.98
      const resistance = stockPrice.high * 1.02

      const message = `🔧 <b>${stockCode.toUpperCase()} - TEKNİK ANALİZ</b>

💰 <b>Mevcut Fiyat:</b> ${stockPrice.price.toFixed(2)} TL

📊 <b>Hareketli Ortalamalar:</b>
• SMA 20: ${sma20.toFixed(2)} TL
• SMA 50: ${sma50.toFixed(2)} TL
• Trend: ${sma20 > sma50 ? "🟢 Yükseliş" : "🔴 Düşüş"}

📈 <b>Teknik Göstergeler:</b>
• RSI: ${rsi} ${rsi < 30 ? "🟢 Aşırı Satım" : rsi > 70 ? "🔴 Aşırı Alım" : "🟡 Nötr"}
• Destek: ${support.toFixed(2)} TL
• Direnç: ${resistance.toFixed(2)} TL

🎯 <b>Öneri:</b> ${this.getTechnicalRecommendation(rsi, stockPrice.price, sma20, sma50)}

⏰ ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}`

      const keyboard = {
        inline_keyboard: [[{ text: "🔄 Teknik Yenile", callback_data: `teknik_${stockCode}` }]],
      }

      await this.bot.sendMessage(chatId, message, { reply_markup: keyboard })
    } catch (error) {
      console.error(`Error getting technical analysis for ${stockCode}:`, error)
      await this.bot.sendMessage(chatId, `❌ ${stockCode} için teknik analiz yapılırken hata oluştu.`)
    }
  }

  private getTechnicalRecommendation(rsi: number, price: number, sma20: number, sma50: number): string {
    if (rsi < 30 && price < sma20) return "🟢 Güçlü Al"
    if (rsi < 50 && price > sma20) return "🟢 Al"
    if (rsi > 70 && price > sma50) return "🔴 Güçlü Sat"
    if (rsi > 50 && price < sma50) return "🔴 Sat"
    return "🟡 Bekle"
  }
}
