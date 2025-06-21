import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // TEST: PADDING ON ROOT
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#ff0000",
        color: "white",
        padding: "20px", // ← BU SORUN ÇIKARIYOR MU?
      }}
    >
      <div style={{ fontSize: "48px" }}>CSS TEST 1: PADDING</div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
