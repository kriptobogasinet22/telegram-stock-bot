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

      // HARDCODE VERCEL URL - NO ENV DEPENDENCY
      const baseUrl = "https://telegram-stock-bot-seven.vercel.app"

      console.log(`🌐 Using hardcoded Base URL: ${baseUrl}`)

      // TRY SIMPLE DEPTH FIRST (no complex data)
      try {
        console.log("🔄 Trying simple depth route...")

        const simpleParams = new URLSearchParams()
        simpleParams.set("symbol", data.symbol)
        simpleParams.set("price", data.price.toString())
        simpleParams.set("changePercent", data.changePercent.toString())

        const simpleUrl = `${baseUrl}/api/og/simple-depth?${simpleParams.toString()}`

        console.log(`🚀 Simple depth URL: ${simpleUrl}`)

        const simpleResponse = await fetch(simpleUrl, {
          method: "GET",
          headers: {
            "User-Agent": "TelegramBot/1.0",
            Accept: "image/png,image/*,*/*",
          },
          signal: AbortSignal.timeout(10000),
        })

        console.log(`📡 Simple depth response: ${simpleResponse.status}`)

        if (simpleResponse.ok) {
          const contentType = simpleResponse.headers.get("content-type")
          console.log(`📄 Content type: ${contentType}`)

          if (contentType?.includes("image")) {
            const arrayBuffer = await simpleResponse.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            if (buffer.length > 0) {
              console.log(`✅ Simple depth chart generated: ${buffer.length} bytes`)
              return buffer
            }
          }
        }

        // Log response for debugging
        const responseText = await simpleResponse.text()
        console.log(`📄 Response text: ${responseText.substring(0, 200)}`)
      } catch (simpleError) {
        console.error("❌ Simple depth failed:", simpleError)
      }

      // FALLBACK: Basic OG
      console.log("🔄 Using basic OG fallback...")

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
      console.error("❌ All depth chart methods failed:", error)
      throw error
    }
  }
}
