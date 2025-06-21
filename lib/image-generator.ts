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
  static async generateDepthImageHTML(data: DepthImageData): Promise<string> {
    try {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
              font-family: 'Courier New', monospace;
              color: white;
              width: 500px;
              height: 700px;
              overflow: hidden;
              position: relative;
              padding: 20px;
            }
            .container {
              width: 100%;
              height: 100%;
              border: 3px solid #00d4ff;
              border-radius: 12px;
              background: rgba(0,0,0,0.8);
              box-shadow: 0 0 30px rgba(0,212,255,0.3);
            }
            .header {
              background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
              box-shadow: 0 4px 15px rgba(0,212,255,0.4);
            }
            .symbol {
              font-size: 28px;
              font-weight: bold;
              color: white;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
              margin-bottom: 8px;
            }
            .price-info {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 20px;
              margin-top: 10px;
            }
            .price {
              font-size: 22px;
              font-weight: bold;
              color: white;
              text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            }
            .change {
              font-size: 18px;
              font-weight: bold;
              padding: 6px 12px;
              border-radius: 8px;
              text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            }
            .change.positive { 
              color: #00ff88; 
              background: rgba(0,255,136,0.2);
              border: 2px solid #00ff88;
            }
            .change.negative { 
              color: #ff4444; 
              background: rgba(255,68,68,0.2);
              border: 2px solid #ff4444;
            }
            
            .table-container {
              padding: 20px;
              height: calc(100% - 180px);
            }
            
            .table-header {
              background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
              padding: 15px 0;
              border: 2px solid #00d4ff;
              border-radius: 8px 8px 0 0;
              display: grid;
              grid-template-columns: 60px 80px 80px 80px 80px 60px;
              gap: 2px;
              font-size: 14px;
              font-weight: bold;
              text-align: center;
              color: #00d4ff;
              text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            }
            
            .table-body {
              background: rgba(0,0,0,0.4);
              border: 2px solid #00d4ff;
              border-top: none;
              border-radius: 0 0 8px 8px;
              max-height: 400px;
              overflow: hidden;
            }
            
            .table-row {
              display: grid;
              grid-template-columns: 60px 80px 80px 80px 80px 60px;
              gap: 2px;
              padding: 8px 0;
              font-size: 12px;
              text-align: center;
              font-weight: bold;
              border-bottom: 1px solid rgba(0,212,255,0.2);
              text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }
            
            .table-row:nth-child(even) { 
              background: rgba(52,73,94,0.3); 
            }
            .table-row:nth-child(odd) { 
              background: rgba(44,62,80,0.3); 
            }
            
            .bid { 
              color: #00ff88; 
              text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            }
            .ask { 
              color: #ff4444; 
              text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            }
            .neutral {
              color: #ffffff;
            }
            
            .footer {
              position: absolute;
              bottom: 20px;
              left: 20px;
              right: 20px;
              background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
              padding: 12px 20px;
              border-radius: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              box-shadow: 0 4px 15px rgba(0,212,255,0.4);
            }
            .footer-left {
              font-size: 16px;
              font-weight: bold;
              color: white;
              text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            }
            .footer-right {
              font-size: 14px;
              color: rgba(255,255,255,0.9);
              text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            }
            .bot-brand {
              position: absolute;
              top: 25px;
              right: 25px;
              background: rgba(0,0,0,0.8);
              color: #00d4ff;
              padding: 8px 15px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              border: 2px solid #00d4ff;
              text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
              box-shadow: 0 2px 10px rgba(0,212,255,0.3);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="bot-brand">🤖 @BorsaAnaliz_Bot</div>
            
            <div class="header">
              <div class="symbol">${data.symbol}</div>
              <div class="price-info">
                <div class="price">${data.price.toFixed(2)}₺</div>
                <div class="change ${data.changePercent >= 0 ? "positive" : "negative"}">
                  ${data.changePercent >= 0 ? "+" : ""}${data.changePercent.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div class="table-container">
              <div class="table-header">
                <div>EMİR</div>
                <div>ADET</div>
                <div>ALIŞ</div>
                <div>SATIŞ</div>
                <div>ADET</div>
                <div>EMİR</div>
              </div>
              
              <div class="table-body">
                ${Array.from({ length: Math.min(20, Math.max(data.bids.length, data.asks.length)) }, (_, i) => {
                  const bid = data.bids[i]
                  const ask = data.asks[i]

                  return `
                    <div class="table-row">
                      <div class="bid">${bid ? i + 1 : ""}</div>
                      <div class="bid">${bid ? this.formatNumber(bid.quantity) : ""}</div>
                      <div class="bid">${bid ? bid.price.toFixed(2) : ""}</div>
                      <div class="ask">${ask ? ask.price.toFixed(2) : ""}</div>
                      <div class="ask">${ask ? this.formatNumber(ask.quantity) : ""}</div>
                      <div class="ask">${ask ? i + 1 : ""}</div>
                    </div>
                  `
                }).join("")}
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-left">${data.symbol} Piyasa Derinliği</div>
              <div class="footer-right">${new Date(data.timestamp).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }).split(" ")[1]}</div>
            </div>
          </div>
        </body>
        </html>
      `
    } catch (error) {
      console.error("Error generating HTML depth image:", error)
      throw error
    }
  }

  static formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toLocaleString()
  }

  // HTML'i screenshot olarak çekmek için
  static async convertHtmlToImage(htmlContent: string): Promise<Buffer> {
    try {
      // Puppeteer benzeri bir servis kullanacağız
      // Bu örnekte htmlcsstoimage.com API'sini kullanabiliriz

      const response = await fetch("https://hcti.io/v1/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HTMLCSS_API_KEY || ""}`,
        },
        body: JSON.stringify({
          html: htmlContent,
          css: "",
          google_fonts: "Courier New",
          viewport_width: 500,
          viewport_height: 700,
          device_scale: 2,
        }),
      })

      if (!response.ok) {
        throw new Error("HTML to Image conversion failed")
      }

      const result = await response.json()

      // Resmi indir
      const imageResponse = await fetch(result.url)
      const imageBuffer = await imageResponse.arrayBuffer()

      return Buffer.from(imageBuffer)
    } catch (error) {
      console.error("Error converting HTML to image:", error)

      // Fallback: Basit bir placeholder image oluştur
      return this.createPlaceholderImage()
    }
  }

  static async createPlaceholderImage(): Promise<Buffer> {
    // SVG placeholder oluştur
    const svg = `
      <svg width="500" height="700" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e3c72"/>
            <stop offset="100%" style="stop-color:#2a5298"/>
          </linearGradient>
        </defs>
        <rect width="500" height="700" fill="url(#bg)"/>
        <rect x="20" y="20" width="460" height="660" fill="rgba(0,0,0,0.8)" stroke="#00d4ff" stroke-width="3" rx="12"/>
        <text x="250" y="100" text-anchor="middle" fill="#00d4ff" font-family="Courier New" font-size="24" font-weight="bold">Derinlik Tablosu</text>
        <text x="250" y="140" text-anchor="middle" fill="white" font-family="Courier New" font-size="18">Görsel hazırlanıyor...</text>
        <text x="250" y="650" text-anchor="middle" fill="#00d4ff" font-family="Courier New" font-size="14">🤖 @BorsaAnaliz_Bot</text>
      </svg>
    `

    return Buffer.from(svg, "utf-8")
  }
}
