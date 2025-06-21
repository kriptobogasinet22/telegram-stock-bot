import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // TEST: NESTED BACKGROUND COLORS
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#0000ff",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "#000", // ← BU SORUN ÇIKARIYOR MU?
          color: "white",
          fontSize: "48px",
        }}
      >
        CSS TEST 3: NESTED BG
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
