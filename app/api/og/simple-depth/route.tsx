import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol") || "THYAO"
    const price = Number.parseFloat(searchParams.get("price") || "25.50")
    const changePercent = Number.parseFloat(searchParams.get("changePercent") || "2.5")

    // Mock data - basit array
    const bids = []
    const asks = []

    for (let i = 0; i < 10; i++) {
      bids.push({
        price: (price - (i + 1) * 0.05).toFixed(2),
        qty: Math.floor(Math.random() * 5000) + 1000,
      })
      asks.push({
        price: (price + (i + 1) * 0.05).toFixed(2),
        qty: Math.floor(Math.random() * 5000) + 1000,
      })
    }

    const changeColor = changePercent >= 0 ? "#00ff88" : "#ff4444"
    const changeSign = changePercent >= 0 ? "+" : ""

    return new ImageResponse(
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1a1a2e",
          color: "white",
          fontFamily: "system-ui",
          padding: "30px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            backgroundColor: "#000",
            border: "2px solid #00d4ff",
            borderRadius: "10px",
            padding: "15px",
          }}
        >
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#00d4ff",
              marginRight: "20px",
            }}
          >
            {symbol}
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginRight: "15px",
            }}
          >
            {price.toFixed(2)} TL
          </div>
          <div
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
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "20px",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          {/* Bids */}
          <div style={{ width: "45%" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#00ff88",
                textAlign: "center",
                marginBottom: "15px",
                backgroundColor: "rgba(0,255,136,0.2)",
                padding: "8px",
                borderRadius: "5px",
              }}
            >
              ALIŞ EMİRLERİ
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {bids.map((bid, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    padding: "5px 10px",
                    backgroundColor: "rgba(0,255,136,0.1)",
                    borderRadius: "3px",
                    color: "#00ff88",
                  }}
                >
                  <span>{bid.price}</span>
                  <span>{bid.qty.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center Line */}
          <div
            style={{
              width: "10%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "3px",
                height: "300px",
                background: "linear-gradient(180deg, #00ff88 0%, #ff4444 100%)",
                borderRadius: "2px",
              }}
            />
          </div>

          {/* Asks */}
          <div style={{ width: "45%" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#ff4444",
                textAlign: "center",
                marginBottom: "15px",
                backgroundColor: "rgba(255,68,68,0.2)",
                padding: "8px",
                borderRadius: "5px",
              }}
            >
              SATIŞ EMİRLERİ
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {asks.map((ask, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    padding: "5px 10px",
                    backgroundColor: "rgba(255,68,68,0.1)",
                    borderRadius: "3px",
                    color: "#ff4444",
                  }}
                >
                  <span>{ask.qty.toLocaleString()}</span>
                  <span>{ask.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "15px",
            backgroundColor: "#00d4ff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#000",
          }}
        >
          <div>📊 PİYASA DERİNLİĞİ</div>
          <div>
            🟢 En İyi Alış: {bids[0].price} | 🔴 En İyi Satış: {asks[0].price}
          </div>
          <div>{new Date().toLocaleTimeString("tr-TR")}</div>
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ff4444",
          color: "white",
          fontSize: "32px",
          fontWeight: "bold",
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
