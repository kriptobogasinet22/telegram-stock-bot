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
  static async generateDepthSVG(data: DepthImageData): Promise<Buffer> {
    try {
      const timeText = new Date(data.timestamp).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })
      const changeColor = data.changePercent >= 0 ? "#00ff88" : "#ff4444"
      const changeSign = data.changePercent >= 0 ? "+" : ""

      let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="500" height="700" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3c72"/>
      <stop offset="100%" style="stop-color:#2a5298"/>
    </linearGradient>
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00d4ff"/>
      <stop offset="100%" style="stop-color:#0099cc"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#00d4ff" flood-opacity="0.3"/>
    </filter>
    <style>
      .title-text { font-family: 'Courier New', monospace; font-weight: bold; fill: white; text-anchor: middle; }
      .price-text { font-family: 'Courier New', monospace; font-weight: bold; fill: white; text-anchor: middle; }
      .change-text { font-family: 'Courier New', monospace; font-weight: bold; text-anchor: middle; }
      .header-text { font-family: 'Courier New', monospace; font-weight: bold; fill: #00d4ff; text-anchor: middle; }
      .bid-text { font-family: 'Courier New', monospace; font-weight: bold; fill: #00ff88; text-anchor: middle; }
      .ask-text { font-family: 'Courier New', monospace; font-weight: bold; fill: #ff4444; text-anchor: middle; }
      .neutral-text { font-family: 'Courier New', monospace; font-weight: bold; fill: white; text-anchor: middle; }
      .footer-text { font-family: 'Courier New', monospace; font-weight: bold; fill: white; }
      .brand-text { font-family: 'Courier New', monospace; font-weight: bold; fill: #00d4ff; text-anchor: middle; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="500" height="700" fill="url(#bgGradient)"/>
  
  <!-- Main Container -->
  <rect x="20" y="20" width="460" height="660" fill="rgba(0,0,0,0.8)" stroke="#00d4ff" stroke-width="3" rx="12" filter="url(#shadow)"/>
  
  <!-- Header -->
  <rect x="30" y="30" width="440" height="80" fill="url(#headerGradient)" rx="8" filter="url(#shadow)"/>
  
  <!-- Bot Brand -->
  <rect x="350" y="35" width="110" height="25" fill="rgba(0,0,0,0.8)" stroke="#00d4ff" stroke-width="2" rx="12"/>
  <text x="405" y="52" class="brand-text" font-size="12">🤖 @BorsaBot</text>
  
  <!-- Stock Symbol -->
  <text x="250" y="65" class="title-text" font-size="24">${data.symbol}</text>
  
  <!-- Price Info -->
  <text x="180" y="95" class="price-text" font-size="18">${data.price.toFixed(2)}₺</text>
  <rect x="280" y="78" width="80" height="22" fill="rgba(${data.changePercent >= 0 ? "0,255,136" : "255,68,68"},0.2)" stroke="${changeColor}" stroke-width="2" rx="6"/>
  <text x="320" y="93" class="change-text" font-size="14" fill="${changeColor}">${changeSign}${data.changePercent.toFixed(2)}%</text>
  
  <!-- Table Header -->
  <rect x="40" y="130" width="420" height="35" fill="rgba(52,73,94,0.8)" stroke="#00d4ff" stroke-width="2" rx="6"/>
  <text x="70" y="152" class="header-text" font-size="12">EMİR</text>
  <text x="140" y="152" class="header-text" font-size="12">ADET</text>
  <text x="210" y="152" class="header-text" font-size="12">ALIŞ</text>
  <text x="290" y="152" class="header-text" font-size="12">SATIŞ</text>
  <text x="360" y="152" class="header-text" font-size="12">ADET</text>
  <text x="430" y="152" class="header-text" font-size="12">EMİR</text>
  
  <!-- Table Body Background -->
  <rect x="40" y="165" width="420" height="400" fill="rgba(0,0,0,0.4)" stroke="#00d4ff" stroke-width="2" rx="0 0 6 6"/>
  
  <!-- Table Rows -->`

      // Add table rows
      for (let i = 0; i < Math.min(20, Math.max(data.bids.length, data.asks.length)); i++) {
        const bid = data.bids[i]
        const ask = data.asks[i]
        const yPos = 185 + i * 20

        // Row background (alternating)
        const bgColor = i % 2 === 0 ? "rgba(52,73,94,0.3)" : "rgba(44,62,80,0.3)"
        svg += `
  <rect x="40" y="${yPos - 10}" width="420" height="20" fill="${bgColor}"/>`

        // Bid data
        if (bid) {
          svg += `
  <text x="70" y="${yPos + 3}" class="bid-text" font-size="11">${i + 1}</text>
  <text x="140" y="${yPos + 3}" class="bid-text" font-size="11">${this.formatNumber(bid.quantity)}</text>
  <text x="210" y="${yPos + 3}" class="bid-text" font-size="11">${bid.price.toFixed(2)}</text>`
        }

        // Ask data
        if (ask) {
          svg += `
  <text x="290" y="${yPos + 3}" class="ask-text" font-size="11">${ask.price.toFixed(2)}</text>
  <text x="360" y="${yPos + 3}" class="ask-text" font-size="11">${this.formatNumber(ask.quantity)}</text>
  <text x="430" y="${yPos + 3}" class="ask-text" font-size="11">${i + 1}</text>`
        }
      }

      svg += `
  
  <!-- Footer -->
  <rect x="30" y="620" width="440" height="50" fill="url(#headerGradient)" rx="8" filter="url(#shadow)"/>
  <text x="50" y="645" class="footer-text" font-size="16">${data.symbol} Piyasa Derinliği</text>
  <text x="50" y="660" class="footer-text" font-size="12">📊 25 kademe analizi</text>
  <text x="420" y="645" class="footer-text" font-size="14" text-anchor="end">${timeText.split(" ")[1]}</text>
  <text x="420" y="660" class="footer-text" font-size="12" text-anchor="end">@BorsaAnaliz_Bot</text>
  
</svg>`

      return Buffer.from(svg, "utf-8")
    } catch (error) {
      console.error("Error generating SVG depth image:", error)
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

  // Basit PNG placeholder (eğer SVG çalışmazsa)
  static async createSimplePNG(): Promise<Buffer> {
    // Base64 encoded 1x1 transparent PNG
    const base64PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    return Buffer.from(base64PNG, "base64")
  }
}
