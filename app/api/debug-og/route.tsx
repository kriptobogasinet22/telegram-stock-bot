import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  try {
    // MINIMAL TEST - NO EXTERNAL DEPENDENCIES
    return new ImageResponse(
      <div
        style={{
          height: "630px",
          width: "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#00ff00",
          color: "#000",
          fontSize: "48px",
          fontWeight: "bold",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div>🟢 DEBUG OG</div>
          <div style={{ fontSize: "32px", marginTop: "20px" }}>MINIMAL TEST WORKING</div>
          <div style={{ fontSize: "24px", marginTop: "20px" }}>{new Date().toISOString()}</div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    return new Response(`Debug OG Error: ${error}`, { status: 500 })
  }
}
