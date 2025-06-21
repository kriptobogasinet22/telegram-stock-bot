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

      // Basit route kullan - /api/og (depth alt route'u yerine)
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXTAUTH_URL || "http://localhost:3000"

      console.log(`🌐 Base URL: ${baseUrl}`)

      // Minimal parametreler
      const params = new URLSearchParams()
      params.set("symbol", data.symbol)
      params.set("price", data.price.toString())
      params.set("changePercent", data.changePercent.toString())
      params.set("bidsCount", data.bids.length.toString())
      params.set("asksCount", data.asks.length.toString())

      const ogUrl = `${baseUrl}/api/og?${params.toString()}`

      console.log(`🚀 Calling simplified OG API: ${ogUrl}`)

      const response = await fetch(ogUrl, {
        method: "GET",
        headers: {
          "User-Agent": "TelegramBot/1.0",
          Accept: "image/png,image/*,*/*",
          "Cache-Control": "no-cache",
        },
        // Timeout
        signal: AbortSignal.timeout(15000), // 15 saniye timeout
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

      return buffer
    } catch (error) {
      console.error("❌ Vercel OG generation error:", error)
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
