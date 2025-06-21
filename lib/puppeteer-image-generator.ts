export interface DepthImageData {
  symbol: string
  price: number
  change: number
  changePercent: number
  bids: Array<{ price: number; quantity: number }>
  asks: Array<{ price: number; quantity: number }>
  timestamp: string
}

export class PuppeteerImageGenerator {
  static async generateDepthPNG(data: DepthImageData): Promise<Buffer> {
    try {
      console.log(`🎭 Generating Puppeteer PNG for ${data.symbol}`)

      // Puppeteer import - dynamic import for server-side
      const puppeteer = await import("puppeteer")

      // HTML content oluştur
      const htmlContent = this.generateHTML(data)

      // Puppeteer browser başlat
      const browser = await puppeteer.default.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-first-run",
          "--no-zygote",
          "--single-process",
        ],
      })

      const page = await browser.newPage()

      // Viewport ayarla
      await page.setViewport({
        width: 600,
        height: 800,
        deviceScaleFactor: 2, // Retina quality
      })

      // HTML content'i yükle
      await page.setContent(htmlContent, {
        waitUntil: "networkidle0",
      })

      // Screenshot al
      const screenshot = await page.screenshot({
        type: "png",
        quality: 90,
        fullPage: true,
      })

      // Browser'ı kapat
      await browser.close()

      console.log(`✅ Puppeteer PNG generated for ${data.symbol}, size: ${screenshot.length} bytes`)
      return screenshot as Buffer
    } catch (error) {
      console.error("Puppeteer PNG generation error:", error)

      // Fallback: Sharp SVG-to-PNG
      return await this.generateSharpPNG(data)
    }
  }

  static generateHTML(data: DepthImageData): string {
    const timeText = new Date(data.timestamp).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })
    const changeColor = data.changePercent >= 0 ? "#00ff88" : "#ff4444"
    const changeSign = data.changePercent >= 0 ? "+" : ""

    return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.symbol} Derinlik</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            width: 600px;
            height: 800px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            color: white;
            overflow: hidden;
            position: relative;
        }
        
        .container {
            margin: 15px;
            background: rgba(0, 0, 0, 0.85);
            border: 3px solid #00d4ff;
            border-radius: 16px;
            height: 770px;
            position: relative;
            box-shadow: 0 20px 40px rgba(0, 212, 255, 0.3);
        }
        
        .header {
            background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
            margin: 12px;
            padding: 20px;
            border-radius: 12px;
            position: relative;
            box-shadow: 0 8px 16px rgba(0, 212, 255, 0.4);
        }
        
        .brand {
            position: absolute;
            top: 8px;
            right: 12px;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #00d4ff;
            border-radius: 8px;
            padding: 4px 12px;
            font-size: 11px;
            font-weight: 700;
            color: #00d4ff;
            letter-spacing: 0.5px;
        }
        
        .symbol {
            font-size: 32px;
            font-weight: 800;
            text-align: center;
            margin-bottom: 8px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            letter-spacing: 1px;
        }
        
        .price-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
        }
        
        .price {
            font-size: 22px;
            font-weight: 700;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .change {
            background: rgba(${data.changePercent >= 0 ? "0,255,136" : "255,68,68"},0.25);
            border: 2px solid ${changeColor};
            border-radius: 8px;
            padding: 6px 16px;
            font-size: 16px;
            font-weight: 700;
            color: ${changeColor};
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .table-container {
            margin: 15px;
            background: rgba(0, 0, 0, 0.6);
            border: 2px solid #00d4ff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        }
        
        .table-header {
            background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
            border-bottom: 2px solid #00d4ff;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            padding: 14px 8px;
            font-size: 13px;
            font-weight: 700;
            color: #00d4ff;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .table-body {
            max-height: 480px;
            overflow: hidden;
        }
        
        .table-row {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            padding: 10px 8px;
            font-size: 12px;
            font-weight: 600;
            text-align: center;
            border-bottom: 1px solid rgba(52, 73, 94, 0.4);
            transition: background-color 0.2s ease;
        }
        
        .table-row:nth-child(even) {
            background: rgba(52, 73, 94, 0.25);
        }
        
        .table-row:hover {
            background: rgba(0, 212, 255, 0.1);
        }
        
        .bid-data {
            color: #00ff88;
            font-weight: 700;
            text-shadow: 0 0 4px rgba(0, 255, 136, 0.3);
        }
        
        .ask-data {
            color: #ff4444;
            font-weight: 700;
            text-shadow: 0 0 4px rgba(255, 68, 68, 0.3);
        }
        
        .footer {
            position: absolute;
            bottom: 12px;
            left: 12px;
            right: 12px;
            background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 8px 16px rgba(0, 212, 255, 0.4);
        }
        
        .footer-left {
            font-size: 14px;
            font-weight: 700;
            line-height: 1.4;
        }
        
        .footer-right {
            text-align: right;
            font-size: 12px;
            font-weight: 600;
            line-height: 1.4;
        }
        
        .stats {
            margin: 15px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid #00d4ff;
            border-radius: 8px;
            padding: 12px;
            display: flex;
            justify-content: space-around;
            font-size: 11px;
            font-weight: 600;
        }
        
        .stat-item {
            text-align: center;
            color: #00d4ff;
        }
        
        .stat-value {
            font-size: 13px;
            font-weight: 700;
            color: white;
            margin-top: 2px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="brand">BORSA BOT</div>
            <div class="symbol">${data.symbol}</div>
            <div class="price-info">
                <div class="price">${data.price.toFixed(2)} ₺</div>
                <div class="change">${changeSign}${data.changePercent.toFixed(2)}%</div>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <div>ALIŞ EMİRLERİ</div>
                <div class="stat-value">${data.bids.length}</div>
            </div>
            <div class="stat-item">
                <div>SATIŞ EMİRLERİ</div>
                <div class="stat-value">${data.asks.length}</div>
            </div>
            <div class="stat-item">
                <div>SPREAD</div>
                <div class="stat-value">${((data.asks[0]?.price || 0) - (data.bids[0]?.price || 0)).toFixed(2)} ₺</div>
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
                ${this.generateTableRows(data)}
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-left">
                <div>${data.symbol} PİYASA DERİNLİĞİ</div>
                <div>25 Kademe Profesyonel Analiz</div>
            </div>
            <div class="footer-right">
                <div>${timeText.split(" ")[1]}</div>
                <div>BorsaAnaliz Bot</div>
            </div>
        </div>
    </div>
</body>
</html>`
  }

  static generateTableRows(data: DepthImageData): string {
    let rows = ""
    const maxRows = Math.min(22, Math.max(data.bids.length, data.asks.length))

    for (let i = 0; i < maxRows; i++) {
      const bid = data.bids[i]
      const ask = data.asks[i]

      rows += `<div class="table-row">
                <div class="bid-data">${bid ? i + 1 : ""}</div>
                <div class="bid-data">${bid ? this.formatNumber(bid.quantity) : ""}</div>
                <div class="bid-data">${bid ? bid.price.toFixed(2) : ""}</div>
                <div class="ask-data">${ask ? ask.price.toFixed(2) : ""}</div>
                <div class="ask-data">${ask ? this.formatNumber(ask.quantity) : ""}</div>
                <div class="ask-data">${ask ? i + 1 : ""}</div>
              </div>`
    }

    return rows
  }

  // Fallback: Sharp SVG-to-PNG (improved)
  static async generateSharpPNG(data: DepthImageData): Promise<Buffer> {
    try {
      console.log("Fallback: Generating improved Sharp PNG")

      const sharp = require("sharp")

      // Improved SVG with better text rendering
      const svgContent = `
        <svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1e3c72"/>
              <stop offset="100%" style="stop-color:#2a5298"/>
            </linearGradient>
            <linearGradient id="header" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00d4ff"/>
              <stop offset="100%" style="stop-color:#0099cc"/>
            </linearGradient>
          </defs>
          
          <rect width="600" height="800" fill="url(#bg)"/>
          <rect x="15" y="15" width="570" height="770" fill="rgba(0,0,0,0.85)" stroke="#00d4ff" stroke-width="3" rx="16"/>
          
          <rect x="27" y="27" width="546" height="80" fill="url(#header)" rx="12"/>
          
          <text x="300" y="70" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">${data.symbol}</text>
          <text x="60" y="95" fill="white" font-family="Arial, sans-serif" font-size="22" font-weight="bold">${data.price.toFixed(2)} ₺</text>
          
          <rect x="400" y="75" width="120" height="28" fill="rgba(${data.changePercent >= 0 ? "0,255,136" : "255,68,68"},0.25)" stroke="${data.changePercent >= 0 ? "#00ff88" : "#ff4444"}" stroke-width="2" rx="8"/>
          <text x="460" y="93" text-anchor="middle" fill="${data.changePercent >= 0 ? "#00ff88" : "#ff4444"}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${data.changePercent >= 0 ? "+" : ""}${data.changePercent.toFixed(2)}%</text>
          
          <text x="300" y="400" text-anchor="middle" fill="#00d4ff" font-family="Arial, sans-serif" font-size="24" font-weight="bold">PİYASA DERİNLİĞİ</text>
          <text x="300" y="430" text-anchor="middle" fill="#00d4ff" font-family="Arial, sans-serif" font-size="18">25 Kademe Analiz</text>
          <text x="300" y="460" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16">Puppeteer yüklenemedi - Fallback</text>
          
          <text x="300" y="750" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">BorsaAnaliz Bot</text>
        </svg>
      `

      const pngBuffer = await sharp(Buffer.from(svgContent))
        .png({
          quality: 95,
          compressionLevel: 6,
          adaptiveFiltering: true,
        })
        .toBuffer()

      return pngBuffer
    } catch (error) {
      console.error("Sharp PNG generation failed:", error)

      // En basit fallback
      return Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00,
        0x02, 0x58, 0x00, 0x00, 0x03, 0x20, 0x08, 0x02, 0x00, 0x00, 0x00, 0x15, 0x14, 0x15, 0x2d, 0x00, 0x00, 0x00,
        0x0c, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d,
        0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ])
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
