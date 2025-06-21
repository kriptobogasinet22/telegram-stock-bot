export interface DepthImageData {
  symbol: string
  price: number
  change: number
  changePercent: number
  bids: Array<{ price: number; quantity: number }>
  asks: Array<{ price: number; quantity: number }>
  timestamp: string
}

export class VercelOGGenerator {
  static async generateDepthPNG(data: DepthImageData): Promise<Buffer> {
    try {
      console.log(`🎨 Generating Vercel OG PNG for ${data.symbol}`)

      // URL oluşturma - daha güvenli
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXTAUTH_URL || "http://localhost:3000"

      console.log(`🌐 Base URL: ${baseUrl}`)

      // Parametreleri encode et
      const params = new URLSearchParams()
      params.set("symbol", data.symbol)
      params.set("price", data.price.toString())
      params.set("change", data.change.toString())
      params.set("changePercent", data.changePercent.toString())
      params.set("bidsCount", data.bids.length.toString())
      params.set("asksCount", data.asks.length.toString())
      params.set("bestBid", data.bids[0]?.price.toString() || "0")
      params.set("bestAsk", data.asks[0]?.price.toString() || "0")
      params.set("timestamp", data.timestamp)

      // JSON'ları güvenli şekilde encode et
      try {
        params.set("bids", JSON.stringify(data.bids.slice(0, 10)))
        params.set("asks", JSON.stringify(data.asks.slice(0, 10)))
      } catch (jsonError) {
        console.error("JSON encoding error:", jsonError)
        // Fallback data
        params.set("bids", JSON.stringify([{ price: data.price - 0.05, quantity: 1000 }]))
        params.set("asks", JSON.stringify([{ price: data.price + 0.05, quantity: 1000 }]))
      }

      const ogUrl = `${baseUrl}/api/og/depth?${params.toString()}`

      console.log(`🚀 Calling OG API: ${ogUrl.substring(0, 150)}...`)

      const response = await fetch(ogUrl, {
        method: "GET",
        headers: {
          "User-Agent": "TelegramBot/1.0",
          Accept: "image/png,image/*,*/*",
          "Cache-Control": "no-cache",
        },
        // Timeout ekle
        signal: AbortSignal.timeout(10000), // 10 saniye timeout
      })

      console.log(`📡 Response status: ${response.status}`)
      console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ OG API failed: ${response.status}`)
        console.error(`❌ Error response: ${errorText.substring(0, 500)}`)
        throw new Error(`OG API failed: ${response.status} - ${errorText.substring(0, 200)}`)
      }

      const contentType = response.headers.get("content-type")
      console.log(`📄 Content-Type: ${contentType}`)

      if (!contentType?.includes("image")) {
        const responseText = await response.text()
        console.error(`❌ Not an image response: ${responseText.substring(0, 300)}`)
        throw new Error(`Response is not an image: ${contentType}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      console.log(`✅ PNG generated for ${data.symbol}, size: ${buffer.length} bytes`)

      if (buffer.length === 0) {
        throw new Error("PNG buffer is empty")
      }

      // Buffer'ın gerçekten PNG olduğunu kontrol et
      if (!buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
        console.error("❌ Buffer is not a valid PNG")
        throw new Error("Buffer is not a valid PNG")
      }

      return buffer
    } catch (error) {
      console.error("❌ Vercel OG generation error:", error)

      // Fallback: Basit text buffer döndür - Telegram bu durumda ASCII tablo gösterecek
      throw error // Error'u yukarı fırlat ki ASCII fallback çalışsın
    }
  }

  static formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toString()
  }
}
