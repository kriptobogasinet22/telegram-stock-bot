import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol") || "THYAO"
    const price = Number.parseFloat(searchParams.get("price") || "25.50")
    const changePercent = Number.parseFloat(searchParams.get("changePercent") || "2.5")

    const changeColor = changePercent >= 0 ? "#00ff88" : "#ff4444"
    const changeSign = changePercent >= 0 ? "+" : ""

    // MANUAL DATA - NO ARRAYS OR LOOPS
    const bid1Price = (price - 0.05).toFixed(2)
    const bid2Price = (price - 0.1).toFixed(2)
    const bid3Price = (price - 0.15).toFixed(2)
    const bid4Price = (price - 0.2).toFixed(2)
    const bid5Price = (price - 0.25).toFixed(2)

    const ask1Price = (price + 0.05).toFixed(2)
    const ask2Price = (price + 0.1).toFixed(2)
    const ask3Price = (price + 0.15).toFixed(2)
    const ask4Price = (price + 0.2).toFixed(2)
    const ask5Price = (price + 0.25).toFixed(2)

    return new ImageResponse(
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#1a1a2e",
          color: "white",
          padding: "30px",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#000",
            border: "2px solid #00d4ff",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#00d4ff",
              marginRight: "20px",
            }}
          >
            {symbol}
          </span>
          <span
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginRight: "15px",
            }}
          >
            {price.toFixed(2)} TL
          </span>
          <span
            style={{
              backgroundColor: changeColor,
              borderRadius: "8px",
              padding: "5px 15px",
              fontSize: "20px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {changeSign}
            {changePercent.toFixed(2)}%
          </span>
        </div>

        {/* Content - SIMPLE BLOCKS */}
        <div style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "10px", padding: "20px" }}>
          {/* Bids Header */}
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#00ff88",
              backgroundColor: "rgba(0,255,136,0.2)",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            ALIŞ EMİRLERİ
          </div>

          {/* Manual Bids - NO LOOPS */}
          <div
            style={{
              backgroundColor: "rgba(0,255,136,0.1)",
              padding: "8px 15px",
              borderRadius: "3px",
              marginBottom: "3px",
              color: "#00ff88",
              fontSize: "16px",
            }}
          >
            {bid1Price} TL - 1,250 Adet
          </div>
          <div
            style={{
              backgroundColor: "rgba(0,255,136,0.1)",
              padding: "8px 15px",
              borderRadius: "3px",
              marginBottom: "3px",
              color: "#00ff88",
              fontSize: "16px",
            }}
          >
            {bid2Price} TL - 2,100 Adet
          </div>
          <div
            style={{
              backgroundColor: "rgba(0,255,136,0.1)",
              padding: "8px 15px",
              borderRadius: "3px",
              marginBottom: "3px",
              color: "#00ff88",
              fontSize: "16px",
            }}
          >
            {bid3Price} TL - 1,800 Adet
          </div>
          <div
            style={{
              backgroundColor: "rgba(0,255,136,0.1)",
              padding: "8px 15px",
              borderRadius: "3px",
              marginBottom: "3px",
              color: "#00ff88",
              fontSize: "16px",
            }}
          >
            {bid4Price} TL - 3,200 Adet
          </div>
          <div
            style={{
              backgroundColor: "rgba(0,255,136,0.1)",
              padding: "8px 15px",
              borderRadius: "3px",
              marginBottom: "15px",
              color: "#00ff88",
              fontSize: "16px",
            }}
          >
            {bid5Price} TL - 1,500 Adet
          </div>

          {/* Asks Header */}
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#ff4444",
              backgroundColor: "rgba(255,68,68,0.2)",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            SATIŞ EMİRLERİ
          </div>

          {/* Manual Asks - NO LOOPS */}
          <div
            style={{
              backgroundColor: "rgba(255,68,68,0.1)",
              padding: "8px 15px",
              borderRadius: "3px",
              marginBottom: "3px",
              color: "#ff4444",
              fontSize: "16px",
            }}
          >
            1,400 Adet - {ask1Price} TL
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,68,68,0.1)",
              padding: "8px 15px",
              borderRadius: "3px",
              marginBottom: "3px",
              color: "#ff4444",
              fontSize: "16px",
            }}
          >
            2,800 Adet - {ask2Price} TL
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,68,68,0.1)",
              padding: "8px 15px",
              borderRadius: "3px",
              marginBottom: "3px",
              color: "#ff4444",
              fontSize: "16px",
            }}
          >
            1,900 Adet - {ask3Price} TL
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,68,68,0.1)",
              padding: "8px 15px",
              borderRadius: "3px",
              marginBottom: "3px",
              color: "#ff4444",
              fontSize: "16px",
            }}
          >
            3,500 Adet - {ask4Price} TL
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,68,68,0.1)",
              padding: "8px 15px",
              borderRadius: "3px",
              marginBottom: "15px",
              color: "#ff4444",
              fontSize: "16px",
            }}
          >
            2,200 Adet - {ask5Price} TL
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: "#00d4ff",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#000",
              textAlign: "center",
            }}
          >
            📊 PİYASA DERİNLİĞİ - {new Date().toLocaleTimeString("tr-TR")}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    return new ImageResponse(
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#ff0000",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
        }}
      >
        ERROR: {String(error)}
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  }
}
