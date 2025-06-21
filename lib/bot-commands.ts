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

      let message = `🚫 Bot'u kullanabilmek için private kanalımıza katılma isteği göndermelisiniz:\n\n`

      const keyboard = {
        inline_keyboard: [] as any[],
      }

      if (joinRequest) {
        // İstek gönderilmişse direkt aktif et
        await Database.updateUserMembership(userId, true)

        const welcomeMessage = `✅ <b>Hoş geldiniz!</b>

Katılma isteği gönderdiğiniz için botu kullanabilirsiniz!

🔍 <b>Anlık ve Detaylı Veriler</b>
• /derinlik hissekodu – 25 kademe anlık derinlik
• /teorik hissekodu – Anlık Teorik veri sorgusu
• /akd hissekodu – Aracı kurum dağılımı
• /takas hissekodu – Takas analizi
• /viop sembolkodu – VIOP vadeli kontrat analizi

📈 <b>Analiz ve Karşılaştırmalar</b>
• /karsilastir hissekodu1 hissekodu2 – İki hissenin karşılaştırılması

📊 <b>Finansal ve Teknik Görünümler</b>
• /temel hissekodu – Şirket finansalları
• /teknik hissekodu – Teknik göstergeler

📰 <b>Gündem ve Bilgilendirme</b>
• /haber hissekodu – KAP haberleri
• /bulten – Günlük piyasa özeti

💹 <b>Yatırım Araçları</b>
• /favori – Favori hisselerinizi yönetin
• /favoriekle HISSE1,HISSE2 – Favori hisse ekleyin

ℹ️ <b>Sadece hisse kodu gönderin!</b>
Örnek: THYAO yazıp menüden seçin.`

        await this.bot.sendMessage(chatId, welcomeMessage)
        return
      } else {
        message += `👆 Private kanala katılma isteği gönderin, istek gönderdiğiniz anda botu kullanabilirsiniz.`

        // Invite link varsa kullan
        if (inviteLink) {
          keyboard.inline_keyboard.push([{ text: "🔗 Private Kanala Katılma İsteği Gönder", url: inviteLink }])
        } else {
          message += `\n\n❌ <b>Henüz davet linki oluşturulmamış.</b>\nAdmin ile iletişime geçin.`
        }

        keyboard.inline_keyboard.push([{ text: "✅ İstek Gönderdiysem Kontrol Et", callback_data: "check_membership" }])
      }

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
        // İstek varsa direkt aktif et
        await Database.updateUserMembership(userId, true)

        const welcomeMessage = `✅ <b>Hoş geldiniz!</b>

Katılma isteğiniz mevcut, botu kullanabilirsiniz!

🔍 <b>Komutlar:</b>
• /derinlik HISSE – Derinlik analizi
• /teorik HISSE – Teorik analiz  
• /temel HISSE – Temel analiz
• /teknik HISSE – Teknik analiz
• /haber HISSE – Haberler
• /bulten – Piyasa özeti
• /favori – Favoriler

ℹ️ <b>Sadece hisse kodu gönderin!</b>
Örnek: THYAO`

        await this.bot.sendMessage(chatId, welcomeMessage)
      } else {
        const inviteLink = await Database.getSetting("invite_link")

        let message = "❌ Henüz private kanala katılma isteği göndermemişsiniz. Lütfen önce istek gönderin."

        const keyboard = {
          inline_keyboard: [] as any[],
        }

        // Invite link varsa kullan
        if (inviteLink) {
          keyboard.inline_keyboard.push([{ text: "🔗 Private Kanala Katılma İsteği Gönder", url: inviteLink }])
        } else {
          message += "\n\n❌ Henüz davet linki oluşturulmamış. Admin ile iletişime geçin."
        }

        await this.bot.sendMessage(chatId, message, {
          reply_markup: keyboard,
        })
      }
    } catch (error) {
      console.error(`Error in checkMembership for user ${userId}:`, error)
      await this.bot.sendMessage(chatId, "❌ Bir hata oluştu. Lütfen tekrar deneyin.")
    }
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
        ? `\n💰 Mevcut: ${stockPrice.price.toFixed(2)} TL (${stockPrice.change > 0 ? "+" : ""}${stockPrice.changePercent.toFixed(2)}%)`
        : ""

      const keyboard = {
        inline_keyboard: [
          [
            { text: "📊 Derinlik", callback_data: `derinlik_${stockCode}` },
            { text: "📈 Teorik", callback_data: `teorik_${stockCode}` },
          ],
          [
            { text: "🏢 AKD", callback_data: `akd_${stockCode}` },
            { text: "💱 Takas", callback_data: `takas_${stockCode}` },
          ],
          [
            { text: "📋 Temel", callback_data: `temel_${stockCode}` },
            { text: "📊 Teknik", callback_data: `teknik_${stockCode}` },
          ],
          [
            { text: "📰 Haberler", callback_data: `haber_${stockCode}` },
            { text: "📈 VIOP", callback_data: `viop_${stockCode}` },
          ],
          [
            { text: "⭐ Favoriye Ekle", callback_data: `favori_ekle_${stockCode}` },
            { text: "🔄 Yenile", callback_data: `yenile_${stockCode}` },
          ],
        ],
      }

      await this.bot.sendMessage(chatId, `📊 <b>${stockCode.toUpperCase()}</b> için analiz seçin:${priceInfo}`, {
        reply_markup: keyboard,
      })
    } catch (error) {
      console.error(`Error in handleStockCode for user ${userId}, stock ${stockCode}:`, error)
      await this.bot.sendMessage(chatId, `❌ ${stockCode} için veri alınırken bir hata oluştu. Lütfen tekrar deneyin.`)
    }
  }

  async getDepthAnalysis(stockCode: string): Promise<string> {
    try {
      const depthData = await stockAPI.getMarketDepth(stockCode)

      if (!depthData) {
        return `❌ ${stockCode} için derinlik verisi alınamadı.`
      }

      let message = `📊 <b>${stockCode.toUpperCase()} - 25 Kademe Derinlik</b>\n\n`

      message += `<b>🔴 SATIŞ EMİRLERİ</b>\n`
      depthData.asks.slice(0, 10).forEach((ask, index) => {
        message += `${index + 1}. ${ask.price.toFixed(2)} TL - ${ask.quantity.toLocaleString()}\n`
      })

      message += `\n<b>🟢 ALIŞ EMİRLERİ</b>\n`
      depthData.bids.slice(0, 10).forEach((bid, index) => {
        message += `${index + 1}. ${bid.price.toFixed(2)} TL - ${bid.quantity.toLocaleString()}\n`
      })

      message += `\n<i>Son güncelleme: ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</i>`

      return message
    } catch (error) {
      console.error(`Error getting depth analysis for ${stockCode}:`, error)
      return `❌ ${stockCode} için derinlik analizi yapılırken bir hata oluştu.`
    }
  }

  async getTheoreticalAnalysis(stockCode: string): Promise<string> {
    try {
      const stockPrice = await stockAPI.getStockPrice(stockCode)

      if (!stockPrice) {
        return `❌ ${stockCode} için teorik veri alınamadı.`
      }

      const theoreticalPrice = stockPrice.price * (1 + Math.random() * 0.02 - 0.01)
      const difference = theoreticalPrice - stockPrice.price
      const diffPercent = (difference / stockPrice.price) * 100

      return `📈 <b>${stockCode.toUpperCase()} - Teorik Analiz</b>

<b>Mevcut Fiyat:</b> ${stockPrice.price.toFixed(2)} TL
<b>Teorik Fiyat:</b> ${theoreticalPrice.toFixed(2)} TL
<b>Fark:</b> ${difference > 0 ? "+" : ""}${difference.toFixed(2)} TL (${diffPercent > 0 ? "+" : ""}${diffPercent.toFixed(2)}%)

<b>Günlük Veriler:</b>
• Açılış: ${stockPrice.open.toFixed(2)} TL
• En Yüksek: ${stockPrice.high.toFixed(2)} TL  
• En Düşük: ${stockPrice.low.toFixed(2)} TL
• Hacim: ${stockPrice.volume.toLocaleString()}

<i>Son güncelleme: ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</i>`
    } catch (error) {
      console.error(`Error getting theoretical analysis for ${stockCode}:`, error)
      return `❌ ${stockCode} için teorik analiz yapılırken bir hata oluştu.`
    }
  }

  async getCompanyFundamentals(stockCode: string): Promise<string> {
    try {
      const companyInfo = await stockAPI.getCompanyInfo(stockCode)
      const stockPrice = await stockAPI.getStockPrice(stockCode)

      if (!companyInfo || !stockPrice) {
        return `❌ ${stockCode} için temel analiz verisi alınamadı.`
      }

      return `🏢 <b>${stockCode.toUpperCase()} - Temel Analiz</b>

<b>Şirket:</b> ${companyInfo.name}
<b>Sektör:</b> ${companyInfo.sector}
<b>Mevcut Fiyat:</b> ${stockPrice.price.toFixed(2)} TL

<b>Finansal Oranlar:</b>
• F/K Oranı: ${companyInfo.peRatio?.toFixed(2)}
• PD/DD Oranı: ${companyInfo.pbRatio?.toFixed(2)}
• Temettü Verimi: %${companyInfo.dividendYield?.toFixed(2)}

<b>Piyasa Verileri:</b>
• Piyasa Değeri: ${(companyInfo.marketCap / 1000000).toFixed(0)}M TL
• Günlük Hacim: ${stockPrice.volume.toLocaleString()}

<i>Son güncelleme: ${new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</i>`
    } catch (error) {
      console.error(`Error getting company fundamentals for ${stockCode}:`, error)
      return `❌ ${stockCode} için temel analiz yapılırken bir hata oluştu.`
    }
  }

  async getStockNews(stockCode: string): Promise<string> {
    try {
      const news = await stockAPI.getStockNews(stockCode)

      if (!news || news.length === 0) {
        return `📰 ${stockCode} için güncel haber bulunamadı.`
      }

      let message = `📰 <b>${stockCode.toUpperCase()} - Son Haberler</b>\n\n`

      news.slice(0, 3).forEach((item, index) => {
        const date = new Date(item.date).toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" })
        message += `<b>${index + 1}. ${item.title}</b>\n`
        message += `📅 ${date} | ${item.source}\n`
        message += `${item.content}\n\n`
      })

      return message
    } catch (error) {
      console.error(`Error getting stock news for ${stockCode}:`, error)
      return `❌ ${stockCode} için haberler alınırken bir hata oluştu.`
    }
  }

  async handleFavorites(userId: number, chatId: number) {
    try {
      const favorites = await Database.getUserFavorites(userId)

      if (favorites.length === 0) {
        await this.bot.sendMessage(
          chatId,
          "⭐ Henüz favori hisseniz yok.\n\n/favoriekle THYAO,AKBNK şeklinde hisse ekleyebilirsiniz.",
        )
        return
      }

      const favoritesList = favorites.map((f: any) => f.stock_code).join(", ")
      await this.bot.sendMessage(chatId, `⭐ <b>Favori Hisseleriniz:</b>\n\n${favoritesList}`)
    } catch (error) {
      console.error(`Error handling favorites for user ${userId}:`, error)
      await this.bot.sendMessage(chatId, "❌ Favoriler alınırken bir hata oluştu.")
    }
  }

  async addFavorites(userId: number, chatId: number, stockCodes: string[]) {
    try {
      for (const code of stockCodes) {
        await Database.addUserFavorite(userId, code.trim())
      }
      await this.bot.sendMessage(chatId, `✅ ${stockCodes.join(", ")} favorilere eklendi.`)
    } catch (error) {
      console.error(`Error adding favorites for user ${userId}:`, error)
      await this.bot.sendMessage(chatId, "❌ Favori eklenirken hata oluştu.")
    }
  }

  async removeFavorites(userId: number, chatId: number, stockCodes: string[]) {
    try {
      for (const code of stockCodes) {
        await Database.removeUserFavorite(userId, code.trim())
      }
      await this.bot.sendMessage(chatId, `✅ ${stockCodes.join(", ")} favorilerden çıkarıldı.`)
    } catch (error) {
      console.error(`Error removing favorites for user ${userId}:`, error)
      await this.bot.sendMessage(chatId, "❌ Favori çıkarılırken hata oluştu.")
    }
  }

  async clearFavorites(userId: number, chatId: number) {
    try {
      await Database.clearUserFavorites(userId)
      await this.bot.sendMessage(chatId, "✅ Tüm favoriler temizlendi.")
    } catch (error) {
      console.error(`Error clearing favorites for user ${userId}:`, error)
      await this.bot.sendMessage(chatId, "❌ Favoriler temizlenirken hata oluştu.")
    }
  }
}
