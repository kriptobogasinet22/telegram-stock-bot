import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    console.log("🎨 Depth OG Route called!")

    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol") || "THYAO"
    const price = Number.parseFloat(searchParams.get("price") || "25.50")
    const changePercent = Number.parseFloat(searchParams.get("changePercent") || "2.5")

    // Parse bids and asks - BASIT YAKLAŞIM
    let bidsData = []
    let asksData = []

    try {
      const bidsParam = searchParams.get("bids")
      const asksParam = searchParams.get("asks")

      if (bidsParam) {
        bidsData = JSON.parse(decodeURIComponent(bidsParam)).slice(0, 15) // Sadece 15 kademe
      }
      if (asksParam) {
        asksData = JSON.parse(decodeURIComponent(asksParam)).slice(0, 15)
      }
    } catch (parseError) {
      console.log("Using mock data due to parse error")
      // Mock data
      for (let i = 0; i < 15; i++) {
        bidsData.push({
          price: price - (i + 1) * 0.05,
          quantity: Math.floor(Math.random() * 5000) + 1000,
        })
        asksData.push({
          price: price + (i + 1) * 0.05,
          quantity: Math.floor(Math.random() * 5000) + 1000,
        })
      }
    }

    const changeColor = changePercent >= 0 ? "#00ff88" : "#ff4444"

    // BASIT VE GÜVENİLİR GÖRSEL
    return new ImageResponse(
      <div
        style={{
          height: "630px",
          width: "1200px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)",
          fontFamily: "system-ui",
          color: "white",
          padding: "30px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            background: "rgba(0, 0, 0, 0.8)",
            border: "3px solid #00d4ff",
            borderRadius: "15px",
            padding: "20px 30px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            <div
              style={{
                fontSize: "42px",
                fontWeight: "900",
                color: "#00d4ff",
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
                background: changeColor,
                borderRadius: "10px",
                padding: "8px 20px",
                fontSize: "24px",
                fontWeight: "700",
                color: "white",
              }}
            >
              {changePercent >= 0 ? "+" : ""}
              {changePercent.toFixed(2)}%
            </div>
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#00d4ff",
            }}
          >
            PİYASA DERİNLİĞİ
          </div>
        </div>

        {/* Simple Table */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "20px",
            background: "rgba(0, 0, 0, 0.6)",
            border: "2px solid #333",
            borderRadius: "15px",
            padding: "30px",
          }}
        >
          {/* Bids */}
          <div style={{ width: "45%" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#00ff88",
                marginBottom: "20px",
                textAlign: "center",
                background: "rgba(0, 255, 136, 0.2)",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              ALIŞ EMİRLERİ
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {bidsData.slice(0, 12).map((bid: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                    padding: "6px 12px",
                    background: "rgba(0, 255, 136, 0.1)",
                    borderRadius: "4px",
                    color: "#00ff88",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>{bid.price?.toFixed(2)}</span>
                  <span>{formatNumber(bid.quantity)}</span>
                </div>
              ))}
            </div>
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
                width: "4px",
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
                fontSize: "20px",
                fontWeight: "700",
                color: "#ff4444",
                marginBottom: "20px",
                textAlign: "center",
                background: "rgba(255, 68, 68, 0.2)",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              SATIŞ EMİRLERİ
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {asksData.slice(0, 12).map((ask: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                    padding: "6px 12px",
                    background: "rgba(255, 68, 68, 0.1)",
                    borderRadius: "4px",
                    color: "#ff4444",
                  }}
                >
                  <span>{formatNumber(ask.quantity)}</span>
                  <span style={{ fontWeight: "600" }}>{ask.price?.toFixed(2)}</span>
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
            marginTop: "20px",
            background: "#00d4ff",
            padding: "15px 25px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#000",
          }}
        >
          <div>📊 {symbol} - PİYASA DERİNLİĞİ</div>
          <div>{new Date().toLocaleTimeString("tr-TR")}</div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("❌ Depth OG error:", error)

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
          fontSize: "48px",
          fontWeight: "bold",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>❌</div>
          <div>OG Generation Error</div>
          <div style={{ fontSize: "24px", marginTop: "20px" }}>Fallback Mode</div>
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
