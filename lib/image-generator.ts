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
  static async generateProfessionalDepthSVG(data: DepthImageData): Promise<string> {
    try {
      const width = 400
      const height = 600

      // Renk paleti
      const colors = {
        background: "#1a1a1a",
        headerBg: "#2a2a2a",
        tableBg: "#1e1e1e",
        headerText: "#00d4ff",
        priceText: "#ffffff",
        changePositive: "#00ff88",
        changeNegative: "#ff4444",
        bidColor: "#00aa44",
        askColor: "#dd3333",
        borderColor: "#333333",
        rowEven: "#252525",
        rowOdd: "#1e1e1e",
      }

      let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .bg { fill: ${colors.background}; }
            .header-bg { fill: ${colors.headerBg}; }
            .table-bg { fill: ${colors.tableBg}; }
            .row-even { fill: ${colors.rowEven}; }
            .row-odd { fill: ${colors.rowOdd}; }
            .symbol { fill: ${colors.headerText}; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; }
            .price { fill: ${colors.priceText}; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; }
            .change-pos { fill: ${colors.changePositive}; font-family: 'Courier New', monospace; font-size: 14px; font-weight: bold; }
            .change-neg { fill: ${colors.changeNegative}; font-family: 'Courier New', monospace; font-size: 14px; font-weight: bold; }
            .header-text { fill: ${colors.priceText}; font-family: 'Courier New', monospace; font-size: 10px; font-weight: bold; }
            .bid-text { fill: ${colors.bidColor}; font-family: 'Courier New', monospace; font-size: 9px; }
            .ask-text { fill: ${colors.askColor}; font-family: 'Courier New', monospace; font-size: 9px; }
            .footer-text { fill: ${colors.headerText}; font-family: 'Courier New', monospace; font-size: 12px; font-weight: bold; }
            .border { stroke: ${colors.borderColor}; stroke-width: 1; fill: none; }
          </style>
        </defs>
        
        <!-- Ana arka plan -->
        <rect width="${width}" height="${height}" class="bg"/>
        
        <!-- Header arka plan -->
        <rect x="0" y="0" width="${width}" height="50" class="header-bg"/>
        <rect x="0" y="0" width="${width}" height="50" class="border"/>
        
        <!-- Başlık bilgileri -->
        <text x="20" y="25" class="symbol">${data.symbol}</text>
        <text x="100" y="25" class="price">${data.price.toFixed(2)}₺</text>
        <text x="200" y="25" class="${data.changePercent >= 0 ? "change-pos" : "change-neg"}">${data.changePercent >= 0 ? "+" : ""}${data.changePercent.toFixed(2)}%</text>
        
        <!-- Tablo başlık arka planı -->
        <rect x="0" y="50" width="${width}" height="25" class="table-bg"/>
        <rect x="0" y="50" width="${width}" height="25" class="border"/>
        
        <!-- Tablo başlıkları -->
        <text x="15" y="67" class="header-text">EMİR</text>
        <text x="55" y="67" class="header-text">ADET</text>
        <text x="120" y="67" class="header-text">ALIŞ</text>
        <text x="180" y="67" class="header-text">SATIŞ</text>
        <text x="240" y="67" class="header-text">ADET</text>
        <text x="320" y="67" class="header-text">EMİR</text>
        
        <!-- Dikey çizgiler -->
        <line x1="50" y1="50" x2="50" y2="${height - 30}" class="border"/>
        <line x1="115" y1="50" x2="115" y2="${height - 30}" class="border"/>
        <line x1="165" y1="50" x2="165" y2="${height - 30}" class="border"/>
        <line x1="235" y1="50" x2="235" y2="${height - 30}" class="border"/>
        <line x1="315" y1="50" x2="315" y2="${height - 30}" class="border"/>
      `

      // Tablo satırları
      const startY = 75
      const rowHeight = 18
      const maxRows = Math.min(25, Math.max(data.bids.length, data.asks.length))

      for (let i = 0; i < maxRows && startY + i * rowHeight < height - 50; i++) {
        const y = startY + i * rowHeight
        const isEven = i % 2 === 0

        // Satır arka planı
        svg += `<rect x="0" y="${y - 12}" width="${width}" height="${rowHeight}" class="${isEven ? "row-even" : "row-odd"}"/>`

        // Yatay çizgi
        if (i > 0) {
          svg += `<line x1="0" y1="${y - 12}" x2="${width}" y2="${y - 12}" stroke="${colors.borderColor}" stroke-width="0.5"/>`
        }

        // Alış emirleri (sol taraf)
        if (i < data.bids.length) {
          const bid = data.bids[i]
          svg += `
            <text x="15" y="${y}" class="bid-text">${i + 1}</text>
            <text x="55" y="${y}" class="bid-text">${this.formatNumber(bid.quantity)}</text>
            <text x="120" y="${y}" class="bid-text">${bid.price.toFixed(2)}</text>
          `
        }

        // Satış emirleri (sağ taraf)
        if (i < data.asks.length) {
          const ask = data.asks[i]
          svg += `
            <text x="180" y="${y}" class="ask-text">${ask.price.toFixed(2)}</text>
            <text x="240" y="${y}" class="ask-text">${this.formatNumber(ask.quantity)}</text>
            <text x="320" y="${y}" class="ask-text">${i + 1}</text>
          `
        }
      }

      // Alt çerçeve
      svg += `<rect x="0" y="${height - 30}" width="${width}" height="30" class="header-bg"/>`
      svg += `<rect x="0" y="${height - 30}" width="${width}" height="30" class="border"/>`

      // Footer
      svg += `<text x="20" y="${height - 10}" class="footer-text">${data.symbol} Piyasa Derinliği</text>`

      // Dış çerçeve
      svg += `<rect x="0" y="0" width="${width}" height="${height}" class="border"/>`

      svg += `</svg>`

      return svg
    } catch (error) {
      console.error("Error generating professional SVG depth image:", error)
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

  static async generateDepthHTML(data: DepthImageData): Promise<string> {
    try {
      const timeText = new Date(data.timestamp).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              background: #1a1a1a;
              font-family: 'Courier New', monospace;
              color: white;
              width: 400px;
              height: 600px;
              overflow: hidden;
            }
            .container {
              width: 100%;
              height: 100%;
              border: 1px solid #333;
            }
            .header {
              background: #2a2a2a;
              padding: 15px 20px;
              border-bottom: 1px solid #333;
              display: flex;
              align-items: center;
              gap: 20px;
            }
            .symbol {
              font-size: 18px;
              font-weight: bold;
              color: #00d4ff;
            }
            .price {
              font-size: 16px;
              font-weight: bold;
              color: white;
            }
            .change {
              font-size: 14px;
              font-weight: bold;
            }
            .change.positive { color: #00ff88; }
            .change.negative { color: #ff4444; }
            
            .table-header {
              background: #1e1e1e;
              padding: 8px 0;
              border-bottom: 1px solid #333;
              display: grid;
              grid-template-columns: 35px 60px 50px 50px 60px 35px;
              gap: 5px;
              font-size: 10px;
              font-weight: bold;
              text-align: center;
            }
            
            .table-body {
              height: calc(100% - 120px);
              overflow: hidden;
            }
            
            .table-row {
              display: grid;
              grid-template-columns: 35px 60px 50px 50px 60px 35px;
              gap: 5px;
              padding: 4px 0;
              font-size: 9px;
              text-align: center;
              border-bottom: 0.5px solid #333;
            }
            
            .table-row:nth-child(even) { background: #252525; }
            .table-row:nth-child(odd) { background: #1e1e1e; }
            
            .bid { color: #00aa44; }
            .ask { color: #dd3333; }
            
            .footer {
              background: #2a2a2a;
              padding: 8px 20px;
              border-top: 1px solid #333;
              font-size: 12px;
              font-weight: bold;
              color: #00d4ff;
              position: absolute;
              bottom: 0;
              width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="symbol">${data.symbol}</div>
              <div class="price">${data.price.toFixed(2)}₺</div>
              <div class="change ${data.changePercent >= 0 ? "positive" : "negative"}">
                ${data.changePercent >= 0 ? "+" : ""}${data.changePercent.toFixed(2)}%
              </div>
            </div>
            
            <div class="table-header">
              <div>EMİR</div>
              <div>ADET</div>
              <div>ALIŞ</div>
              <div>SATIŞ</div>
              <div>ADET</div>
              <div>EMİR</div>
            </div>
            
            <div class="table-body">
              ${Array.from({ length: Math.min(25, Math.max(data.bids.length, data.asks.length)) }, (_, i) => {
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
            
            <div class="footer">
              ${data.symbol} Piyasa Derinliği
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
}
