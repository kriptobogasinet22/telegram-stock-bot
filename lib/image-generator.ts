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
  static async generateDepthImageSVG(data: DepthImageData): Promise<string> {
    try {
      const width = 800
      const height = 1000
      
      // SVG başlangıcı
      let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .bg { fill: #1a1a1a; }
            .title { fill: #00d4ff; font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; }
            .price { fill: #ffffff; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; }
            .change-positive { fill: #00ff88; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; }
            .change-negative { fill: #ff4444; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; }
            .header { fill: #666666; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; }
            .bid { fill: #00aa44; font-family: Arial, sans-serif; font-size: 14px; }
            .ask { fill: #dd3333; font-family: Arial, sans-serif; font-size: 14px; }
            .footer { fill: #666666; font-family: Arial, sans-serif; font-size: 14px; }
            .timestamp { fill: #888888; font-family: Arial, sans-serif; font-size: 12px; }
            .brand { fill: #00d4ff; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; }
          </style>
        </defs>
        
        <!-- Arka plan -->
        <rect width="${width}" height="${height}" class="bg"/>
        
        <!-- Başlık -->
        <text x="50" y="60" class="title">${data.symbol}</text>
        <text x="200" y="60" class="price">${data.price.toFixed(2)}₺</text>
        <text x="350" y="60" class="${data.changePercent >= 0 ? 'change-positive' : 'change-negative'}">${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%</text>
        
        <!-- Tablo başlıkları -->
        <text x="50" y="120" class="header">EMİR</text>
        <text x="120" y="120" class="header">ADET</text>
        <text x="200" y="120" class="header">ALIŞ</text>
        <text x="320" y="120" class="header">SATIŞ</text>
        <text x="400" y="120" class="header">ADET</text>
        <text x="480" y="120" class="header">EMİR</text>
        
        <!-- Çizgi -->
        <line x1="50" y1="130" x2="550" y2="130" stroke="#333333" stroke-width="1"/>
      `

      // Derinlik verilerini ekle
      const startY = 150
      const rowHeight = 25
      const maxRows = Math.min(25, Math.max(data.bids.length, data.asks.length))

      for (let i = 0; i < maxRows; i++) {
        const y = startY + i * rowHeight

        // Alış emirleri (sol taraf)
        if (i < data.bids.length) {
          const bid = data.bids[i]
          svg += `
            <text x="50" y="${y}" class="bid">${i + 1}</text>
            <text x="120" y="${y}" class="bid">${bid.quantity.toLocaleString()}</text>
            <text x="200" y="${y}" class="bid">${bid.price.toFixed(2)}</text>
          `
        }

        // Satış emirleri (sağ taraf)
        if (i < data.asks.length) {
          const ask = data.asks[i]
          svg += `
            <text x="320" y="${y}" class="ask">${ask.price.toFixed(2)}</text>
            <text x="400" y="${y}" class="ask">${ask.quantity.toLocaleString()}</text>
            <text x="480" y="${y}" class="ask">${i + 1}</text>
          `
        }
      }

      // Alt bilgi
      const footerY = height - 100
      const timeText = new Date(data.timestamp).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })
      
      svg += `
        <text x="50" y="${footerY}" class="footer">${data.symbol} Piyasa Derinliği</text>
        <text x="50" y="${footerY + 25}" class="timestamp">Son güncelleme: ${timeText}</text>
        <text x="${width - 200}" y="${footerY}" class="brand">Borsa Analiz Bot</text>
      </svg>`

      return svg
    } catch (error) {
      console.error("Error generating SVG depth image:", error)
      throw error
    }
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
            body {
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
              font-family: 'Arial', sans-serif;
              color: white;
              width: 760px;
              height: 960px;
            }
            .container {
              background: #1a1a1a;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            .header {
              display: flex;
              align-items: center;
              gap: 20px;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #333;
            }
            .symbol {
              font-size: 36px;
              font-weight: bold;
              color: #00d4ff;
            }
            .price {
              font-size: 32px;
              font-weight: bold;
              color: white;
            }
            .change {
              font-size: 24px;
              font-weight: bold;
              padding: 5px 15px;
              border-radius: 20px;
            }
            .change.positive {
              color: #00ff88;
              background: rgba(0, 255, 136, 0.1);
            }
            .change.negative {
              color: #ff4444;
              background: rgba(255, 68, 68, 0.1);
            }
            .depth-table {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin: 30px 0;
            }
            .bids, .asks {
              background: rgba(255,255,255,0.02);
              border-radius: 8px;
              padding: 20px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #333;
            }
            .bids .section-title {
              color: #00aa44;
            }
            .asks .section-title {
              color: #dd3333;
            }
            .depth-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid rgba(255,255,255,0.05);
              font-size: 14px;
            }
            .depth-row:last-child {
              border-bottom: none;
            }
            .bids .depth-row {
              color: #00aa44;
            }
            .asks .depth-row {
              color: #dd3333;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #333;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 14px;
              color: #888;
            }
            .brand {
              color: #00d4ff;
              font-weight: bold;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="symbol">${data.symbol}</div>
              <div class="price">${data.price.toFixed(2)}₺</div>
              <div class="change ${data.changePercent >= 0 ? 'positive' : 'negative'}">
                ${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%
              </div>
            </div>
            
            <div class="depth-table">
              <div class="bids">
                <div class="section-title">🟢 ALIŞ EMİRLERİ</div>
                ${data.bids.slice(0, 15).map((bid, index) => `
                  <div class="depth-row">
                    <span>${bid.price.toFixed(2)}</span>
                    <span>${bid.quantity.toLocaleString()}</span>
                  </div>
                `).join('')}
              </div>
              
              <div class="asks">
                <div class="section-title">🔴 SATIŞ EMİRLERİ</div>
                ${data.asks.slice(0, 15).map((ask, index) => `
                  <div class="depth-row">
                    <span>${ask.price.toFixed(2)}</span>
                    <span>${ask.quantity.toLocaleString()}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="footer">
              <div>
                <div>${data.symbol} Piyasa Derinliği</div>
                <div>Son güncelleme: ${timeText}</div>
              </div>
              <div class="brand">Borsa Analiz Bot</div>
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
