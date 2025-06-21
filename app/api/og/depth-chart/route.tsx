import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    console.log("🎨 Depth Chart OG Route called!")

    const { searchParams } = new URL(request.url)
    console.log("📊 Search params:", Object.fromEntries(searchParams.entries()))

    const symbol = searchParams.get("symbol") || "THYAO"
    const price = Number.parseFloat(searchParams.get("price") || "25.50")
    const changePercent = Number.parseFloat(searchParams.get("changePercent") || "2.5")

    // Parse bids and asks from query params
    let bidsData = []
    let asksData = []

    try {
      const bidsParam = searchParams.get("bids")
      const asksParam = searchParams.get("asks")

      if (bidsParam) {
        bidsData = JSON.parse(decodeURIComponent(bidsParam))
      }
      if (asksParam) {
        asksData = JSON.parse(decodeURIComponent(asksParam))
      }

      console.log("📊 Parsed data:", {
        symbol,
        price,
        changePercent,
        bidsCount: bidsData.length,
        asksCount: asksData.length,
      })
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError)
      // Use mock data if parsing fails
      bidsData = Array.from({ length: 25 }, (_, i) => ({
        price: price - (i + 1) * 0.05,
        quantity: Math.floor(Math.random() * 10000) + 1000,
      }))
      asksData = Array.from({ length: 25 }, (_, i) => ({
        price: price + (i + 1) * 0.05,
        quantity: Math.floor(Math.random() * 10000) + 1000,
      }))
    }

    const changeColor = changePercent >= 0 ? "#00ff88" : "#ff4444"
    const changeSign = changePercent >= 0 ? "+" : ""

    // Calculate max quantities for scaling
    const maxBidQty = Math.max(...bidsData.map((b) => b.quantity))
    const maxAskQty = Math.max(...asksData.map((a) => a.quantity))
    const maxQty = Math.max(maxBidQty, maxAskQty)

    console.log("🎨 Creating Depth Chart ImageResponse...")

    return new ImageResponse(
      <div
        style={{
          height: "630px",
          width: "1200px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "white",
          padding: "20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            background: "rgba(0, 0, 0, 0.8)",
            border: "2px solid #00d4ff",
            borderRadius: "12px",
            padding: "15px 25px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                fontSize: "36px",
                fontWeight: "900",
                letterSpacing: "2px",
                color: "#00d4ff",
              }}
            >
              {symbol}
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              {price.toFixed(2)} TL
            </div>
            <div
              style={{
                background: `rgba(${changePercent >= 0 ? "0,255,136" : "255,68,68"},0.2)`,
                border: `2px solid ${changeColor}`,
                borderRadius: "8px",
                padding: "6px 15px",
                fontSize: "20px",
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
              fontSize: "16px",
              fontWeight: "700",
              color: "#00d4ff",
            }}
          >
            PİYASA DERİNLİĞİ
          </div>
        </div>

        {/* Chart Area */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "10px",
            background: "rgba(0, 0, 0, 0.6)",
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          {/* Bids (Left Side) */}
          <div
            style={{
              width: "48%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#00ff88",
                marginBottom: "15px",
                textAlign: "center",
                background: "rgba(0, 255, 136, 0.1)",
                padding: "8px",
                borderRadius: "6px",
              }}
            >
              ALIŞ EMİRLERİ ({bidsData.length})
            </div>

            {/* Bids Chart */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {bidsData.slice(0, 20).map((bid: any, i: number) => {
                const widthPercent = (bid.quantity / maxQty) * 100
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "12px",
                      height: "22px",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        textAlign: "right",
                        marginRight: "8px",
                        color: "#00ff88",
                        fontWeight: "600",
                      }}
                    >
                      {bid.price?.toFixed(2)}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: "18px",
                        background: "rgba(0, 0, 0, 0.3)",
                        borderRadius: "2px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${widthPercent}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, rgba(0,255,136,0.8) 0%, rgba(0,255,136,0.4) 100%)",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        width: "50px",
                        textAlign: "left",
                        marginLeft: "8px",
                        color: "#888",
                        fontSize: "11px",
                      }}
                    >
                      {formatNumber(bid.quantity)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Center Line */}
          <div
            style={{
              width: "4%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "2px",
                height: "80%",
                background: "linear-gradient(180deg, #00ff88 0%, #ff4444 100%)",
                borderRadius: "1px",
              }}
            />
          </div>

          {/* Asks (Right Side) */}
          <div
            style={{
              width: "48%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#ff4444",
                marginBottom: "15px",
                textAlign: "center",
                background: "rgba(255, 68, 68, 0.1)",
                padding: "8px",
                borderRadius: "6px",
              }}
            >
              SATIŞ EMİRLERİ ({asksData.length})
            </div>

            {/* Asks Chart */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {asksData.slice(0, 20).map((ask: any, i: number) => {
                const widthPercent = (ask.quantity / maxQty) * 100
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "12px",
                      height: "22px",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        textAlign: "right",
                        marginRight: "8px",
                        color: "#888",
                        fontSize: "11px",
                      }}
                    >
                      {formatNumber(ask.quantity)}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: "18px",
                        background: "rgba(0, 0, 0, 0.3)",
                        borderRadius: "2px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${widthPercent}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, rgba(255,68,68,0.4) 0%, rgba(255,68,68,0.8) 100%)",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        width: "60px",
                        textAlign: "left",
                        marginLeft: "8px",
                        color: "#ff4444",
                        fontWeight: "600",
                      }}
                    >
                      {ask.price?.toFixed(2)}
                    </div>
                  </div>
                )
              })}
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
            background: "linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700" }}>📊 {symbol} - 25 KADEME DERİNLİK</div>
            <div>
              🟢 En İyi Alış: {bidsData[0]?.price?.toFixed(2)} TL | 🔴 En İyi Satış: {asksData[0]?.price?.toFixed(2)} TL
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>{new Date().toLocaleTimeString("tr-TR")}</div>
            <div>@BorsaOzelDerinlik_Bot</div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("❌ Depth Chart OG Route error:", error)

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
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>❌ ERROR</div>
          <div>Depth Chart Generation Failed</div>
          <div style={{ fontSize: "20px", marginTop: "20px" }}>
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
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
