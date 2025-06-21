import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  // ULTRA MINIMAL DEPTH - SADECE ÇALIŞAN CSS
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol") || "THYAO"
  const price = searchParams.get("price") || "25.50"

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#1a1a2e",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Header - SADECE ÇALIŞAN STYLES */}
      <div
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#00d4ff",
        }}
      >
        {symbol} - {price} TL
      </div>

      {/* Content - SADECE TEXT */}
      <div style={{ fontSize: "24px", color: "#00ff88" }}>ALIŞ: 25.45 - 1000 | 25.40 - 2000 | 25.35 - 1500</div>

      <div style={{ fontSize: "24px", color: "#ff4444" }}>SATIŞ: 1000 - 25.55 | 2000 - 25.60 | 1500 - 25.65</div>

      <div style={{ fontSize: "16px", color: "#00d4ff" }}>📊 PİYASA DERİNLİĞİ</div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
