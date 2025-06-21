import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // TEST: MARGIN BOTTOM
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#00ff00",
        color: "black",
      }}
    >
      <div
        style={{
          fontSize: "48px",
          marginBottom: "10px", // ← BU SORUN ÇIKARIYOR MU?
        }}
      >
        CSS TEST 2: MARGIN
      </div>
      <div style={{ fontSize: "24px" }}>Second line</div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
