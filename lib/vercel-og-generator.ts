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

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXTAUTH_URL || "http://localhost:3000"

      console.log(`🌐 Base URL: ${baseUrl}`)

      // URL parametrelerini hazırla
      const params = new URLSearchParams()
      params.set("symbol", data.symbol)
      params.set("price", data.price.toString())
      params.set("changePercent", data.changePercent.toString())

      // Bids ve asks verilerini JSON olarak encode et
      params.set("bids", encodeURIComponent(JSON.stringify(data.bids.slice(0, 25))))
      params.set("asks", encodeURIComponent(JSON.stringify(data.asks.slice(0, 25))))

      const ogUrl = `${baseUrl}/api/og/depth-chart?${params.toString()}`

      console.log(`🚀 Calling Depth Chart OG API: ${ogUrl.substring(0, 150)}...`)

      const response = await fetch(ogUrl, {
        method: "GET",
        headers: {
          "User-Agent": "TelegramBot/1.0",
          Accept: "image/png,image/*,*/*",
          "Cache-Control": "no-cache",
        },
        signal: AbortSignal.timeout(20000), // 20 saniye timeout
      })

      console.log(`📡 Response status: ${response.status}`)
      console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Depth Chart OG API failed: ${response.status}`)
        console.error(`❌ Error response: ${errorText.substring(0, 500)}`)
        throw new Error(`Depth Chart OG API failed: ${response.status} - ${errorText.substring(0, 200)}`)
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

      console.log(`✅ Depth Chart generated for ${data.symbol}, size: ${buffer.length} bytes`)

      if (buffer.length === 0) {
        throw new Error("Depth Chart buffer is empty")
      }

      // PNG header kontrolü
      const pngHeader = buffer.slice(0, 8)
      const expectedPngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

      if (!pngHeader.equals(expectedPngHeader)) {
        console.warn("⚠️ Generated file may not be a valid PNG")
      }

      return buffer
    } catch (error) {
      console.error("❌ Vercel Depth Chart generation error:", error)
      throw error
    }
  }

  // Basit OG image generation (fallback)
  static async generateSimpleOG(data: DepthImageData): Promise<Buffer> {
    try {
      console.log(`🎨 Generating Simple OG for ${data.symbol}`)

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXTAUTH_URL || "http://localhost:3000"

      const params = new URLSearchParams()
      params.set("symbol", data.symbol)
      params.set("price", data.price.toString())
      params.set("changePercent", data.changePercent.toString())
      params.set("bidsCount", data.bids.length.toString())
      params.set("asksCount", data.asks.length.toString())

      const ogUrl = `${baseUrl}/api/og?${params.toString()}`

      console.log(`🚀 Calling Simple OG API: ${ogUrl}`)

      const response = await fetch(ogUrl, {
        method: "GET",
        headers: {
          "User-Agent": "TelegramBot/1.0",
          Accept: "image/png,image/*,*/*",
          "Cache-Control": "no-cache",
        },
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        throw new Error(`Simple OG API failed: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      console.log(`✅ Simple OG generated for ${data.symbol}, size: ${buffer.length} bytes`)
      return buffer
    } catch (error) {
      console.error("❌ Simple OG generation error:", error)
      throw error
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
