import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // TEST: BORDER RADIUS
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#ffff00",
        color: "black",
      }}
    >
      <div
        style={{
          backgroundColor: "#000",
          color: "white",
          fontSize: "48px",
          borderRadius: "10px", // ← BU SORUN ÇIKARIYOR MU?
        }}
      >
        CSS TEST 4: BORDER RADIUS
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
