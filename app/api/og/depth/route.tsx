import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const symbol = searchParams.get("symbol") || "STOCK"
    const price = Number.parseFloat(searchParams.get("price") || "0")
    const changePercent = Number.parseFloat(searchParams.get("changePercent") || "0")
    const bidsCount = Number.parseInt(searchParams.get("bidsCount") || "0")
    const asksCount = Number.parseInt(searchParams.get("asksCount") || "0")
    const bestBid = Number.parseFloat(searchParams.get("bestBid") || "0")
    const bestAsk = Number.parseFloat(searchParams.get("bestAsk") || "0")

    // Parse bids and asks from query params
    const bidsData = JSON.parse(searchParams.get("bids") || "[]")
    const asksData = JSON.parse(searchParams.get("asks") || "[]")

    const changeColor = changePercent >= 0 ? "#00ff88" : "#ff4444"
    const changeSign = changePercent >= 0 ? "+" : ""
    const spread = (bestAsk - bestBid).toFixed(2)

    // Vercel OG built-in font kullan - garantili çalışır
    return new ImageResponse(
      <div
        style={{
          height: "800px",
          width: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif", // System fonts - garantili!
          color: "white",
          padding: "20px",
        }}
      >
        {/* Main Container */}
        <div
          style={{
            width: "560px",
            height: "760px",
            background: "rgba(0, 0, 0, 0.85)",
            border: "3px solid #00d4ff",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
              background: "linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)",
              padding: "20px",
              borderRadius: "12px",
              position: "relative",
            }}
          >
            {/* Brand - Basit text */}
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "12px",
                background: "rgba(0, 0, 0, 0.9)",
                border: "2px solid #00d4ff",
                borderRadius: "8px",
                padding: "4px 12px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#00d4ff",
              }}
            >
              BORSA BOT
            </div>

            {/* Symbol - Büyük ve bold */}
            <div
              style={{
                fontSize: "36px",
                fontWeight: "900",
                marginBottom: "8px",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                letterSpacing: "2px",
              }}
            >
              {symbol}
            </div>

            {/* Price and Change */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                }}
              >
                {price.toFixed(2)} TL
              </div>
              <div
                style={{
                  background: `rgba(${changePercent >= 0 ? "0,255,136" : "255,68,68"},0.25)`,
                  border: `2px solid ${changeColor}`,
                  borderRadius: "8px",
                  padding: "6px 16px",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: changeColor,
                }}
              >
                {changeSign}
                {changePercent.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid #00d4ff",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "20px",
              fontSize: "12px",
            }}
          >
            <div style={{ textAlign: "center", color: "#00d4ff" }}>
              <div>ALIS EMIRLERI</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "white", marginTop: "4px" }}>{bidsCount}</div>
            </div>
            <div style={{ textAlign: "center", color: "#00d4ff" }}>
              <div>SATIS EMIRLERI</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "white", marginTop: "4px" }}>{asksCount}</div>
            </div>
            <div style={{ textAlign: "center", color: "#00d4ff" }}>
              <div>SPREAD</div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "white", marginTop: "4px" }}>{spread} TL</div>
            </div>
          </div>

          {/* Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              background: "#34495e",
              padding: "12px 8px",
              fontSize: "14px",
              fontWeight: "700",
              color: "#00d4ff",
              textAlign: "center",
              borderRadius: "8px 8px 0 0",
              border: "2px solid #00d4ff",
              borderBottom: "none",
            }}
          >
            <div>EMIR</div>
            <div>ADET</div>
            <div>ALIS</div>
            <div>SATIS</div>
            <div>ADET</div>
            <div>EMIR</div>
          </div>

          {/* Table Body */}
          <div
            style={{
              border: "2px solid #00d4ff",
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              background: "rgba(0, 0, 0, 0.6)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              maxHeight: "400px",
            }}
          >
            {Array.from({ length: Math.min(15, Math.max(bidsData.length, asksData.length)) }).map((_, i) => {
              const bid = bidsData[i]
              const ask = asksData[i]

              return (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    padding: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textAlign: "center",
                    borderBottom: i < 14 ? "1px solid rgba(52, 73, 94, 0.4)" : "none",
                    background: i % 2 === 0 ? "rgba(52, 73, 94, 0.25)" : "transparent",
                  }}
                >
                  <div style={{ color: "#00ff88" }}>{bid ? i + 1 : ""}</div>
                  <div style={{ color: "#00ff88" }}>{bid ? formatNumber(bid.quantity) : ""}</div>
                  <div style={{ color: "#00ff88" }}>{bid ? bid.price.toFixed(2) : ""}</div>
                  <div style={{ color: "#ff4444" }}>{ask ? ask.price.toFixed(2) : ""}</div>
                  <div style={{ color: "#ff4444" }}>{ask ? formatNumber(ask.quantity) : ""}</div>
                  <div style={{ color: "#ff4444" }}>{ask ? i + 1 : ""}</div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              right: "20px",
              background: "linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)",
              padding: "12px 16px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>{symbol} PIYASA DERINLIGI</div>
              <div>Vercel OG - System Fonts</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>{new Date().toLocaleTimeString("tr-TR")}</div>
              <div>BorsaAnaliz Bot</div>
            </div>
          </div>
        </div>
      </div>,
      {
        width: 600,
        height: 800,
        // Vercel OG built-in fonts kullan
        fonts: [
          {
            name: "Inter",
            data: await fetch(
              new URL(
                "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2",
              ),
            ).then((res) => res.arrayBuffer()),
            style: "normal",
            weight: 400,
          },
          {
            name: "Inter",
            data: await fetch(
              new URL(
                "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2",
              ),
            ).then((res) => res.arrayBuffer()),
            style: "normal",
            weight: 700,
          },
        ],
      },
    )
  } catch (error) {
    console.error("Vercel OG error:", error)

    // Fallback - Sadece text
    return new ImageResponse(
      <div
        style={{
          height: "800px",
          width: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e3c72",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "20px" }}>THYAO</div>
          <div>Gorsel Olusturulamadi</div>
          <div style={{ fontSize: "16px", marginTop: "20px" }}>System Fonts Fallback</div>
        </div>
      </div>,
      {
        width: 600,
        height: 800,
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
