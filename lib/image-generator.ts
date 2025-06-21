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
  static async generateProfessionalDepthHTML(data: DepthImageData): Promise<string> {
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
              background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
              font-family: 'Courier New', monospace;
              color: white;
              width: 400px;
              height: 600px;
              overflow: hidden;
              position: relative;
            }
            .container {
              width: 100%;
              height: 100%;
              border: 2px solid #1abc9c;
              border-radius: 8px;
              background: rgba(0,0,0,0.8);
            }
            .header {
              background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
              padding: 15px 20px;
              border-bottom: 2px solid #1abc9c;
              display: flex;
              align-items: center;
              justify-content: space-between;
              box-shadow: 0 2px 10px rgba(26,188,156,0.3);
            }
            .header-left {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .symbol {
              font-size: 22px;
              font-weight: bold;
              color: white;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            }
            .price {
              font-size: 18px;
              font-weight: bold;
              color: white;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .change {
              font-size: 16px;
              font-weight: bold;
              padding: 4px 8px;
              border-radius: 4px;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .change.positive { 
              color: #2ecc71; 
              background: rgba(46,204,113,0.2);
              border: 1px solid #2ecc71;
            }
            .change.negative { 
              color: #e74c3c; 
              background: rgba(231,76,60,0.2);
              border: 1px solid #e74c3c;
            }
            
            .table-header {
              background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
              padding: 12px 0;
              border-bottom: 1px solid #1abc9c;
              display: grid;
              grid-template-columns: 40px 70px 60px 60px 70px 40px;
              gap: 5px;
              font-size: 12px;
              font-weight: bold;
              text-align: center;
              color: #1abc9c;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }
            
            .table-body {
              height: calc(100% - 160px);
              overflow: hidden;
              background: rgba(0,0,0,0.3);
            }
            
            .table-row {
              display: grid;
              grid-template-columns: 40px 70px 60px 60px 70px 40px;
              gap: 5px;
              padding: 6px 0;
              font-size: 11px;
              text-align: center;
              border-bottom: 0.5px solid rgba(26,188,156,0.2);
              font-weight: bold;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }
            
            .table-row:nth-child(even) { 
              background: rgba(52,73,94,0.3); 
            }
            .table-row:nth-child(odd) { 
              background: rgba(44,62,80,0.3); 
            }
            .table-row:hover {
              background: rgba(26,188,156,0.1);
            }
            
            .bid { 
              color: #2ecc71; 
              text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            }
            .ask { 
              color: #e74c3c; 
              text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
            }
            
            .footer {
              background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
              padding: 10px 20px;
              border-top: 2px solid #1abc9c;
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: absolute;
              bottom: 0;
              width: 100%;
              box-shadow: 0 -2px 10px rgba(26,188,156,0.3);
            }
            .footer-left {
              font-size: 14px;
              font-weight: bold;
              color: white;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .footer-right {
              font-size: 12px;
              color: rgba(255,255,255,0.9);
              text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .bot-brand {
              position: absolute;
              top: 8px;
              right: 15px;
              background: rgba(0,0,0,0.7);
              color: #1abc9c;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: bold;
              border: 1px solid #1abc9c;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }
            .watermark {
              position: absolute;
              bottom: 45px;
              right: 15px;
              color: rgba(26,188,156,0.6);
              font-size: 10px;
              font-weight: bold;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="bot-brand">🤖 Borsa Bot</div>
            
            <div class="header">
              <div class="header-left">
                <div class="symbol">${data.symbol}</div>
                <div class="price">${data.price.toFixed(2)}₺</div>
              </div>
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
            
            <div class="watermark">@BorsaAnaliz_Bot</div>
            
            <div class="footer">
              <div class="footer-left">${data.symbol} Piyasa Derinliği</div>
              <div class="footer-right">${timeText.split(" ")[1]}</div>
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

  // PNG olarak göndermek için HTML'i base64 image'a çeviren fonksiyon
  static async generateDepthImageDataURL(data: DepthImageData): Promise<string> {
    try {
      // HTML içeriğini oluştur
      const htmlContent = await this.generateProfessionalDepthHTML(data)

      // HTML'i base64'e çevir
      const base64Html = Buffer.from(htmlContent).toString("base64")

      // Data URL olarak döndür
      return `data:text/html;base64,${base64Html}`
    } catch (error) {
      console.error("Error generating depth image data URL:", error)
      throw error
    }
  }
}
