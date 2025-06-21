import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // EN BASIT DEPTH TESTI
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#ff0000",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "48px",
      }}
    >
      STEP 1 WORKING
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
