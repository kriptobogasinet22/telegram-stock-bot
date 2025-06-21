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

      let baseUrl = "http://localhost:3000"

      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`
      } else if (process.env.NEXTAUTH_URL) {
        baseUrl = process.env.NEXTAUTH_URL
      }

      console.log(`🌐 Using Base URL: ${baseUrl}`)

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
          if (contentType?.includes("image")) {
            const arrayBuffer = await simpleResponse.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            if (buffer.length > 0) {
              console.log(`✅ Simple depth chart generated: ${buffer.length} bytes`)
              return buffer
            }
          }
        }
      } catch (simpleError) {
        console.error("❌ Simple depth failed:", simpleError)
      }

      // FALLBACK: Try complex depth with data
      try {
        console.log("🔄 Trying complex depth route...")

        const params = new URLSearchParams()
        params.set("symbol", data.symbol)
        params.set("price", data.price.toString())
        params.set("changePercent", data.changePercent.toString())

        // Limit data to prevent URL issues
        const limitedBids = data.bids.slice(0, 10)
        const limitedAsks = data.asks.slice(0, 10)

        params.set("bids", encodeURIComponent(JSON.stringify(limitedBids)))
        params.set("asks", encodeURIComponent(JSON.stringify(limitedAsks)))

        const complexUrl = `${baseUrl}/api/og/depth?${params.toString()}`

        console.log(`🚀 Complex depth URL: ${complexUrl.substring(0, 150)}...`)

        const complexResponse = await fetch(complexUrl, {
          method: "GET",
          headers: {
            "User-Agent": "TelegramBot/1.0",
            Accept: "image/png,image/*,*/*",
          },
          signal: AbortSignal.timeout(15000),
        })

        console.log(`📡 Complex depth response: ${complexResponse.status}`)

        if (complexResponse.ok) {
          const contentType = complexResponse.headers.get("content-type")
          if (contentType?.includes("image")) {
            const arrayBuffer = await complexResponse.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            if (buffer.length > 0) {
              console.log(`✅ Complex depth chart generated: ${buffer.length} bytes`)
              return buffer
            }
          }
        }
      } catch (complexError) {
        console.error("❌ Complex depth failed:", complexError)
      }

      // FINAL FALLBACK: Basic OG
      console.log("🔄 Using basic OG fallback...")
      return await this.generateSimpleOG(data)
    } catch (error) {
      console.error("❌ All depth chart methods failed:", error)
      throw error
    }
  }

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
