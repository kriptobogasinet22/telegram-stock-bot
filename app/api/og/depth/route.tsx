import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    console.log("🎨 OG Route called!")

    const { searchParams } = new URL(request.url)
    console.log("📊 Search params:", Object.fromEntries(searchParams.entries()))

    const symbol = searchParams.get("symbol") || "STOCK"
    const price = Number.parseFloat(searchParams.get("price") || "0")
    const changePercent = Number.parseFloat(searchParams.get("changePercent") || "0")
    const bidsCount = Number.parseInt(searchParams.get("bidsCount") || "0")
    const asksCount = Number.parseInt(searchParams.get("asksCount") || "0")
    const bestBid = Number.parseFloat(searchParams.get("bestBid") || "0")
    const bestAsk = Number.parseFloat(searchParams.get("bestAsk") || "0")

    console.log("📈 Parsed data:", { symbol, price, changePercent, bidsCount, asksCount })

    // Parse bids and asks from query params
    let bidsData = []
    let asksData = []

    try {
      bidsData = JSON.parse(searchParams.get("bids") || "[]")
      asksData = JSON.parse(searchParams.get("asks") || "[]")
      console.log("📊 Bids/Asks parsed:", { bidsCount: bidsData.length, asksCount: asksData.length })
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError)
      // Use mock data if parsing fails
      bidsData = [{ price: price - 0.05, quantity: 1000 }]
      asksData = [{ price: price + 0.05, quantity: 1000 }]
    }

    const changeColor = changePercent >= 0 ? "#00ff88" : "#ff4444"
    const changeSign = changePercent >= 0 ? "+" : ""
    const spread = (bestAsk - bestBid).toFixed(2)

    console.log("🎨 Creating ImageResponse...")

    // Basit ve garantili çalışan görsel
    return new ImageResponse(
      <div
        style={{
          height: "630px",
          width: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          padding: "40px",
        }}
      >
        {/* Main Container */}
        <div
          style={{
            width: "1120px",
            height: "550px",
            background: "rgba(0, 0, 0, 0.9)",
            border: "4px solid #00d4ff",
            borderRadius: "20px",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
              background: "linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)",
              padding: "20px 30px",
              borderRadius: "15px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "900",
                  letterSpacing: "3px",
                }}
              >
                {symbol}
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                }}
              >
                {price.toFixed(2)} TL
              </div>
              <div
                style={{
                  background: `rgba(${changePercent >= 0 ? "0,255,136" : "255,68,68"},0.3)`,
                  border: `3px solid ${changeColor}`,
                  borderRadius: "10px",
                  padding: "8px 20px",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: changeColor,
                }}
              >
                {changeSign}
                {changePercent.toFixed(2)}%
              </div>
            </div>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                border: "2px solid #00d4ff",
                borderRadius: "10px",
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "700",
                color: "#00d4ff",
              }}
            >
              BORSA ANALIZ BOT
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              background: "rgba(0, 0, 0, 0.6)",
              border: "2px solid #00d4ff",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "30px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px", color: "#00d4ff", marginBottom: "5px" }}>ALIS EMIRLERI</div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>{bidsCount}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px", color: "#00d4ff", marginBottom: "5px" }}>SATIS EMIRLERI</div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>{asksCount}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px", color: "#00d4ff", marginBottom: "5px" }}>SPREAD</div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>{spread} TL</div>
            </div>
          </div>

          {/* Simple Table */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            {/* Bids */}
            <div
              style={{
                width: "45%",
                background: "rgba(0, 255, 136, 0.1)",
                border: "2px solid #00ff88",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#00ff88",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                ALIS EMIRLERI
              </div>
              {bidsData.slice(0, 8).map((bid: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                    marginBottom: "8px",
                    color: "#00ff88",
                  }}
                >
                  <span>{bid.price?.toFixed(2) || "0.00"}</span>
                  <span>{formatNumber(bid.quantity || 0)}</span>
                </div>
              ))}
            </div>

            {/* Asks */}
            <div
              style={{
                width: "45%",
                background: "rgba(255, 68, 68, 0.1)",
                border: "2px solid #ff4444",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#ff4444",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                SATIS EMIRLERI
              </div>
              {asksData.slice(0, 8).map((ask: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                    marginBottom: "8px",
                    color: "#ff4444",
                  }}
                >
                  <span>{ask.price?.toFixed(2) || "0.00"}</span>
                  <span>{formatNumber(ask.quantity || 0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "40px",
              right: "40px",
              background: "linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)",
              padding: "15px 25px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <div>
              <div style={{ fontSize: "18px", fontWeight: "700" }}>{symbol} PIYASA DERINLIGI</div>
              <div>Vercel OG - Edge Runtime</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>{new Date().toLocaleTimeString("tr-TR")}</div>
              <div>@BorsaAnaliz_Bot</div>
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("❌ OG Route error:", error)

    // Minimal fallback
    return new ImageResponse(
      <div
        style={{
          height: "630px",
          width: "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e3c72",
          color: "white",
          fontSize: "32px",
          fontWeight: "bold",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>ERROR</div>
          <div>OG Generation Failed</div>
          <div style={{ fontSize: "20px", marginTop: "20px" }}>System Fonts Fallback</div>
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
