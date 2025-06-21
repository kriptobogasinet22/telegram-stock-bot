import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    // ARRAY TEST
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol") || "TEST"

    const items = ["Item 1", "Item 2", "Item 3"]

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
          fontSize: "24px",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>STEP 3: {symbol}</div>
        {items.map((item, i) => (
          <div key={i} style={{ margin: "5px" }}>
            {item}
          </div>
        ))}
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
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
          fontSize: "32px",
        }}
      >
        ERROR: {String(error)}
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  }
}
