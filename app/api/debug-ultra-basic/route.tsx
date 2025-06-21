import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // ULTRA BASIC - SADECE ZORUNLU STYLES
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#ffff00",
        color: "black",
      }}
    >
      <div>ULTRA BASIC TEST</div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
