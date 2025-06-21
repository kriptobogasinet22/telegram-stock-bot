import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // STEP 5'TEN SADECE FLEX PROPERTIES ÇIKAR
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#ff00ff",
        color: "white",
        fontSize: "24px",
        // display: "flex", ← ÇIKARILDI
        // flexDirection: "column", ← ÇIKARILDI
        // alignItems: "center", ← ÇIKARILDI
        // justifyContent: "center", ← ÇIKARILDI
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "20px" }}>NO FLEX TEST</div>
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
