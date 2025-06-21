import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  // STEP 5'İN TAM KOPYASI - SADECE RENK DEĞİŞTİRR
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#00ff00", // ← SADECE RENK DEĞİŞTİ
        color: "black", // ← SADECE RENK DEĞİŞTİ
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "20px" }}>EXACT COPY TEST</div>
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
