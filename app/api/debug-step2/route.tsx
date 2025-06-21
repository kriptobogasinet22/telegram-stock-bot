import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  // QUERY PARAMS TEST
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol") || "TEST"

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#00ff00",
        color: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "48px",
      }}
    >
      STEP 2: {symbol}
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
