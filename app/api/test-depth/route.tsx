import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  try {
    console.log("🧪 Test Depth Route called!")

    return new ImageResponse(
      <div
        style={{
          height: "630px",
          width: "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          color: "white",
          fontSize: "48px",
          fontWeight: "bold",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
          <div>DEPTH OG TEST</div>
          <div style={{ fontSize: "32px", marginTop: "20px" }}>THYAO - 25.50 TL</div>
          <div style={{ fontSize: "24px", marginTop: "20px", color: "#00ff88" }}>
            {new Date().toLocaleTimeString("tr-TR")}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    return new Response("Test failed", { status: 500 })
  }
}
