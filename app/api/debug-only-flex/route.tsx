import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // SADECE FLEX PROPERTIES + BASIC STYLES
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#0000ff",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>ONLY FLEX TEST</div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
