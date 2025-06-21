import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // SIMPLE LAYOUT - NO COMPLEX FLEX
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#ffff00",
        color: "black",
        padding: "20px",
      }}
    >
      {/* SIMPLE BLOCKS */}
      <div
        style={{
          backgroundColor: "#000",
          color: "white",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "32px",
        }}
      >
        THYAO - 25.50 TL
      </div>

      <div
        style={{
          backgroundColor: "#00ff88",
          color: "black",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "18px",
        }}
      >
        ALIŞ: 25.45 - 1000
      </div>

      <div
        style={{
          backgroundColor: "#ff4444",
          color: "white",
          padding: "10px",
          fontSize: "18px",
        }}
      >
        SATIŞ: 1000 - 25.55
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
