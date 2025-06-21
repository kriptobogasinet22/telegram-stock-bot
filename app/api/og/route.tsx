import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    console.log("🎨 OG Route called!")

    const { searchParams } = new URL(request.url)
    console.log("📊 Search params:", Object.fromEntries(searchParams.entries()))

    const symbol = searchParams.get("symbol") || "THYAO"
    const price = Number.parseFloat(searchParams.get("price") || "25.50")
    const changePercent = Number.parseFloat(searchParams.get("changePercent") || "2.5")
    const bidsCount = Number.parseInt(searchParams.get("bidsCount") || "25")
    const asksCount = Number.parseInt(searchParams.get("asksCount") || "25")

    console.log("📈 Creating simple OG image for:", { symbol, price, changePercent })

    // Çok basit ve garantili çalışan görsel
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
        {/* Header */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            border: "4px solid #00d4ff",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            width: "1000px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: "900",
              marginBottom: "20px",
              color: "#00d4ff",
            }}
          >
            {symbol}
          </div>

          <div
            style={{
              fontSize: "48px",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            {price.toFixed(2)} TL
          </div>

          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: changePercent >= 0 ? "#00ff88" : "#ff4444",
              marginBottom: "30px",
            }}
          >
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              fontSize: "24px",
              marginBottom: "30px",
            }}
          >
            <div>
              <div style={{ color: "#00d4ff", marginBottom: "10px" }}>ALIS EMİRLERİ</div>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>{bidsCount}</div>
            </div>
            <div>
              <div style={{ color: "#00d4ff", marginBottom: "10px" }}>SATIS EMİRLERİ</div>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>{asksCount}</div>
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)",
              padding: "20px",
              borderRadius: "15px",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            📊 PİYASA DERİNLİĞİ - BORSA ANALİZ BOT
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
          fontSize: "48px",
          fontWeight: "bold",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>THYAO</div>
          <div>BORSA ANALİZ BOT</div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  }
}
