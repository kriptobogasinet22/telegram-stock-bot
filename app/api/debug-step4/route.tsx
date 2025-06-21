import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    // COMPLEX LAYOUT TEST
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol") || "THYAO"
    const price = searchParams.get("price") || "25.50"

    return new ImageResponse(
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#1a1a2e",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          <div style={{ fontSize: "32px", color: "#00d4ff" }}>
            {symbol} - {price} TL
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "50%",
              backgroundColor: "rgba(0,255,136,0.2)",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <div style={{ fontSize: "18px", marginBottom: "10px" }}>ALIŞ</div>
            <div style={{ fontSize: "14px" }}>25.45 - 1000</div>
            <div style={{ fontSize: "14px" }}>25.40 - 2000</div>
            <div style={{ fontSize: "14px" }}>25.35 - 1500</div>
          </div>

          <div
            style={{
              width: "50%",
              backgroundColor: "rgba(255,68,68,0.2)",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <div style={{ fontSize: "18px", marginBottom: "10px" }}>SATIŞ</div>
            <div style={{ fontSize: "14px" }}>1000 - 25.55</div>
            <div style={{ fontSize: "14px" }}>2000 - 25.60</div>
            <div style={{ fontSize: "14px" }}>1500 - 25.65</div>
          </div>
        </div>
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
        STEP 4 ERROR: {String(error)}
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  }
}
