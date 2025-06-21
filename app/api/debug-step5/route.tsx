import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // ARRAY TEST - MANUAL RENDERING
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#ff00ff",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "20px" }}>STEP 5: MANUAL</div>
      {/* MANUAL ARRAY - NO MAP */}
      <div style={{ margin: "5px" }}>Item 1</div>
      <div style={{ margin: "5px" }}>Item 2</div>
      <div style={{ margin: "5px" }}>Item 3</div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
