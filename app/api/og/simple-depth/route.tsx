import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    console.log("🎨 Simple Depth OG Route called!")

    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol") || "THYAO"
    const price = Number.parseFloat(searchParams.get("price") || "25.50")
    const changePercent = Number.parseFloat(searchParams.get("changePercent") || "2.5")

    console.log("📊 Simple depth data:", { symbol, price, changePercent })

    // ALWAYS use mock data for simplicity
    const bidsData = []
    const asksData = []

    for (let i = 0; i < 12; i++) {
      bidsData.push({
        price: price - (i + 1) * 0.05,
        quantity: Math.floor(Math.random() * 5000) + 1000,
      })
      asksData.push({
        price: price + (i + 1) * 0.05,
        quantity: Math.floor(Math.random() * 5000) + 1000,
      })
    }

    const changeColor = changePercent >= 0 ? "#00ff88" : "#ff4444"

    return new ImageResponse(
      <div
        style={{
          height: "630px",
          width: "1200px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          fontFamily: "system-ui",
          color: "white",
          padding: "40px",
        }}
      >
        {/* Title */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
            background: "rgba(0, 0, 0, 0.8)",
            border: "3px solid #00d4ff",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "900",
              color: "#00d4ff",
              marginRight: "30px",
            }}
          >
            {symbol}
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              marginRight: "20px",
            }}
          >
            {price.toFixed(2)} TL
          </div>
          <div
            style={{
              background: changeColor,
              borderRadius: "12px",
              padding: "10px 20px",
              fontSize: "28px",
              fontWeight: "700",
              color: "white",
            }}
          >
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "30px",
            background: "rgba(0, 0, 0, 0.5)",
            border: "2px solid #333",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          {/* Bids */}
          <div style={{ width: "45%" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#00ff88",
                marginBottom: "20px",
                textAlign: "center",
                background: "rgba(0, 255, 136, 0.2)",
                padding: "12px",
                borderRadius: "10px",
              }}
            >
              ALIŞ EMİRLERİ
            </div>

            {bidsData.slice(0, 10).map((bid, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  padding: "8px 15px",
                  background: "rgba(0, 255, 136, 0.1)",
                  borderRadius: "6px",
                  marginBottom: "4px",
                  color: "#00ff88",
                }}
              >
                <span style={{ fontWeight: "600" }}>{bid.price.toFixed(2)}</span>
                <span>{formatNumber(bid.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Center */}
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
                width: "6px",
                height: "400px",
                background: "linear-gradient(180deg, #00ff88 0%, #ff4444 100%)",
                borderRadius: "3px",
              }}
            />
          </div>

          {/* Asks */}
          <div style={{ width: "45%" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#ff4444",
                marginBottom: "20px",
                textAlign: "center",
                background: "rgba(255, 68, 68, 0.2)",
                padding: "12px",
                borderRadius: "10px",
              }}
            >
              SATIŞ EMİRLERİ
            </div>

            {asksData.slice(0, 10).map((ask, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  padding: "8px 15px",
                  background: "rgba(255, 68, 68, 0.1)",
                  borderRadius: "6px",
                  marginBottom: "4px",
                  color: "#ff4444",
                }}
              >
                <span>{formatNumber(ask.quantity)}</span>
                <span style={{ fontWeight: "600" }}>{ask.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            background: "linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)",
            padding: "15px 30px",
            borderRadius: "15px",
            fontSize: "18px",
            fontWeight: "600",
            color: "#000",
          }}
        >
          <div>📊 PİYASA DERİNLİĞİ</div>
          <div>{new Date().toLocaleTimeString("tr-TR")}</div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("❌ Simple Depth OG error:", error)

    return new ImageResponse(
      <div
        style={{
          height: "630px",
          width: "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ff4444",
          color: "white",
          fontSize: "48px",
          fontWeight: "bold",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div>❌ ERROR</div>
          <div style={{ fontSize: "24px", marginTop: "20px" }}>Simple Depth Failed</div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K"
  }
  return num.toString()
}
