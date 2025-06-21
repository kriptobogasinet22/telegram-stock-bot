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
  static async generateDepthChart(data: DepthImageData): Promise<Buffer> {
    try {
      console.log(`🎨 Generating Depth Chart for ${data.symbol}`)

      // DOĞRU BASE URL HESAPLAMA
      let baseUrl = "http://localhost:3000" // Default

      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`
      } else if (process.env.NEXTAUTH_URL) {
        baseUrl = process.env.NEXTAUTH_URL
      }

      console.log(`🌐 Using Base URL: ${baseUrl}`)

      // ÖNCE TEST ROUTE'UNU DENE
      try {
        console.log("🧪 Testing basic OG functionality...")
        const testResponse = await fetch(`${baseUrl}/api/test-depth`, {
          method: "GET",
          headers: {
            "User-Agent": "TelegramBot/1.0",
            Accept: "image/png,image/*,*/*",
          },
          signal: AbortSignal.timeout(10000),
        })

        console.log(`🧪 Test response: ${testResponse.status}`)

        if (!testResponse.ok) {
          console.error(`❌ Test route failed: ${testResponse.status}`)
          throw new Error(`Test route failed: ${testResponse.status}`)
        }
      } catch (testError) {
        console.error("❌ Test route error:", testError)
        throw new Error(`OG system not working: ${testError}`)
      }

      // ASIL DEPTH CHART'I OLUŞTUR
      const params = new URLSearchParams()
      params.set("symbol", data.symbol)
      params.set("price", data.price.toString())
      params.set("changePercent", data.changePercent.toString())

      // Sadece ilk 15 kademeyi gönder (URL limit)
      const limitedBids = data.bids.slice(0, 15)
      const limitedAsks = data.asks.slice(0, 15)

      params.set("bids", encodeURIComponent(JSON.stringify(limitedBids)))
      params.set("asks", encodeURIComponent(JSON.stringify(limitedAsks)))

      const ogUrl = `${baseUrl}/api/og/depth?${params.toString()}`

      console.log(`🚀 Calling Depth OG: ${ogUrl.substring(0, 100)}...`)

      const response = await fetch(ogUrl, {
        method: "GET",
        headers: {
          "User-Agent": "TelegramBot/1.0",
          Accept: "image/png,image/*,*/*",
          "Cache-Control": "no-cache",
        },
        signal: AbortSignal.timeout(15000),
      })

      console.log(`📡 Depth response: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Depth OG failed: ${response.status}`)
        console.error(`❌ Error: ${errorText.substring(0, 200)}`)
        throw new Error(`Depth OG failed: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("image")) {
        throw new Error(`Not an image: ${contentType}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      console.log(`✅ Depth chart generated: ${buffer.length} bytes`)

      if (buffer.length === 0) {
        throw new Error("Empty buffer")
      }

      return buffer
    } catch (error) {
      console.error("❌ Depth chart generation error:", error)

      // FALLBACK: Basit OG kullan
      try {
        console.log("🔄 Trying fallback simple OG...")
        return await this.generateSimpleOG(data)
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError)
        throw new Error(`Both depth chart and fallback failed: ${error}`)
      }
    }
  }

  // Basit fallback
  static async generateSimpleOG(data: DepthImageData): Promise<Buffer> {
    try {
      let baseUrl = "http://localhost:3000"

      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`
      } else if (process.env.NEXTAUTH_URL) {
        baseUrl = process.env.NEXTAUTH_URL
      }

      const params = new URLSearchParams()
      params.set("symbol", data.symbol)
      params.set("price", data.price.toString())
      params.set("changePercent", data.changePercent.toString())

      const ogUrl = `${baseUrl}/api/og?${params.toString()}`

      console.log(`🔄 Fallback OG: ${ogUrl}`)

      const response = await fetch(ogUrl, {
        method: "GET",
        headers: {
          "User-Agent": "TelegramBot/1.0",
          Accept: "image/png",
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new Error(`Fallback failed: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } catch (error) {
      console.error("❌ Fallback error:", error)
      throw error
    }
  }
}
