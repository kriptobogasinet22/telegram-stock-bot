import { createCanvas } from "canvas"

export interface DepthImageData {
  symbol: string
  price: number
  change: number
  changePercent: number
  bids: Array<{ price: number; quantity: number }>
  asks: Array<{ price: number; quantity: number }>
  timestamp: string
}

export class ImageGenerator {
  static async generateDepthImage(data: DepthImageData): Promise<Buffer> {
    try {
      // Canvas boyutları
      const width = 800
      const height = 1000
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext("2d")

      // Arka plan
      ctx.fillStyle = "#1a1a1a"
      ctx.fillRect(0, 0, width, height)

      // Başlık bölümü
      ctx.fillStyle = "#00d4ff"
      ctx.font = "bold 32px Arial"
      ctx.fillText(data.symbol, 50, 60)

      // Fiyat bilgisi
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 28px Arial"
      ctx.fillText(`${data.price.toFixed(2)}₺`, 200, 60)

      // Değişim yüzdesi
      const changeColor = data.changePercent >= 0 ? "#00ff88" : "#ff4444"
      ctx.fillStyle = changeColor
      ctx.font = "bold 24px Arial"
      const changeText = `${data.changePercent >= 0 ? "+" : ""}${data.changePercent.toFixed(2)}%`
      ctx.fillText(changeText, 350, 60)

      // Tablo başlıkları
      const headerY = 120
      ctx.fillStyle = "#666666"
      ctx.font = "bold 16px Arial"

      // Sol taraf başlıkları (Alış emirleri)
      ctx.fillText("EMİR", 50, headerY)
      ctx.fillText("ADET", 120, headerY)
      ctx.fillText("ALIŞ", 200, headerY)

      // Sağ taraf başlıkları (Satış emirleri)
      ctx.fillText("SATIŞ", 320, headerY)
      ctx.fillText("ADET", 400, headerY)
      ctx.fillText("EMİR", 480, headerY)

      // Çizgi çizme
      ctx.strokeStyle = "#333333"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(50, headerY + 10)
      ctx.lineTo(550, headerY + 10)
      ctx.stroke()

      // Derinlik verilerini çiz
      const startY = headerY + 30
      const rowHeight = 25
      const maxRows = Math.min(25, Math.max(data.bids.length, data.asks.length))

      for (let i = 0; i < maxRows; i++) {
        const y = startY + i * rowHeight

        // Alış emirleri (sol taraf) - yeşil tonları
        if (i < data.bids.length) {
          const bid = data.bids[i]
          ctx.fillStyle = "#00aa44"
          ctx.font = "14px Arial"

          // Emir sırası
          ctx.fillText((i + 1).toString(), 50, y)

          // Adet
          ctx.fillText(bid.quantity.toLocaleString(), 120, y)

          // Fiyat
          ctx.fillText(bid.price.toFixed(2), 200, y)
        }

        // Satış emirleri (sağ taraf) - kırmızı tonları
        if (i < data.asks.length) {
          const ask = data.asks[i]
          ctx.fillStyle = "#dd3333"
          ctx.font = "14px Arial"

          // Fiyat
          ctx.fillText(ask.price.toFixed(2), 320, y)

          // Adet
          ctx.fillText(ask.quantity.toLocaleString(), 400, y)

          // Emir sırası
          ctx.fillText((i + 1).toString(), 480, y)
        }
      }

      // Alt bilgi
      const footerY = height - 100
      ctx.fillStyle = "#666666"
      ctx.font = "14px Arial"
      ctx.fillText(`${data.symbol} Piyasa Derinliği`, 50, footerY)

      // Zaman damgası
      ctx.fillStyle = "#888888"
      ctx.font = "12px Arial"
      const timeText = new Date(data.timestamp).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })
      ctx.fillText(`Son güncelleme: ${timeText}`, 50, footerY + 25)

      // Logo/Marka (isteğe bağlı)
      ctx.fillStyle = "#00d4ff"
      ctx.font = "bold 16px Arial"
      ctx.fillText("Borsa Analiz Bot", width - 200, footerY)

      // Canvas'ı buffer'a çevir
      return canvas.toBuffer("image/png")
    } catch (error) {
      console.error("Error generating depth image:", error)
      throw error
    }
  }

  static async generateSimpleDepthImage(data: DepthImageData): Promise<Buffer> {
    try {
      const width = 600
      const height = 800
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext("2d")

      // Arka plan gradyanı
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, "#2a2a2a")
      gradient.addColorStop(1, "#1a1a1a")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Başlık
      ctx.fillStyle = "#00d4ff"
      ctx.font = "bold 28px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${data.symbol} - 25 Kademe Derinlik`, width / 2, 50)

      // Fiyat bilgisi
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 20px Arial"
      ctx.fillText(`Mevcut: ${data.price.toFixed(2)}₺`, width / 2, 80)

      const changeColor = data.changePercent >= 0 ? "#00ff88" : "#ff4444"
      ctx.fillStyle = changeColor
      ctx.font = "16px Arial"
      const changeText = `(${data.changePercent >= 0 ? "+" : ""}${data.changePercent.toFixed(2)}%)`
      ctx.fillText(changeText, width / 2, 105)

      // Tablo başlıkları
      ctx.fillStyle = "#cccccc"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "left"

      const headerY = 150
      ctx.fillText("ALIŞ EMİRLERİ", 50, headerY)
      ctx.fillText("SATIŞ EMİRLERİ", 320, headerY)

      // Çizgi
      ctx.strokeStyle = "#444444"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50, headerY + 10)
      ctx.lineTo(550, headerY + 10)
      ctx.stroke()

      // Derinlik verileri
      const startY = headerY + 30
      const rowHeight = 20
      const maxRows = Math.min(15, Math.max(data.bids.length, data.asks.length))

      ctx.font = "12px Arial"

      for (let i = 0; i < maxRows; i++) {
        const y = startY + i * rowHeight

        // Alış emirleri
        if (i < data.bids.length) {
          const bid = data.bids[i]
          ctx.fillStyle = "#00aa44"
          ctx.fillText(`${bid.price.toFixed(2)} - ${bid.quantity.toLocaleString()}`, 50, y)
        }

        // Satış emirleri
        if (i < data.asks.length) {
          const ask = data.asks[i]
          ctx.fillStyle = "#dd3333"
          ctx.fillText(`${ask.price.toFixed(2)} - ${ask.quantity.toLocaleString()}`, 320, y)
        }
      }

      // Alt bilgi
      ctx.fillStyle = "#888888"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      const timeText = new Date(data.timestamp).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })
      ctx.fillText(`Son güncelleme: ${timeText}`, width / 2, height - 30)

      return canvas.toBuffer("image/png")
    } catch (error) {
      console.error("Error generating simple depth image:", error)
      throw error
    }
  }
}
