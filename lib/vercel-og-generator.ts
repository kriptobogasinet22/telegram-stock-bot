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

      // Hardcoded Vercel URL
      const baseUrl = "https://telegram-stock-bot-seven.vercel.app"

      const params = new URLSearchParams()
      params.set("symbol", data.symbol)
      params.set("price", data.price.toString())
      params.set("changePercent", data.changePercent.toString())

      const url = `${baseUrl}/api/og/simple-depth?${params.toString()}`

      console.log(`🚀 Fetching: ${url}`)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "TelegramBot/1.0",
          Accept: "image/png",
        },
        signal: AbortSignal.timeout(10000),
      })

      console.log(`📡 Response: ${response.status}`)

      if (!response.ok) {
        throw new Error(`OG failed: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      console.log(`✅ Chart generated: ${buffer.length} bytes`)
      return buffer
    } catch (error) {
      console.error("❌ Chart generation failed:", error)
      throw error
    }
  }
}
