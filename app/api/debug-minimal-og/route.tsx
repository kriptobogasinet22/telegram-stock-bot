import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  try {
    // EN MINIMAL MÜMKÜN OG
    return new ImageResponse(
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ff0000",
          color: "white",
          fontSize: "48px",
        }}
      >
        MINIMAL TEST
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    // Hata durumunda text response
    return new Response(`OG Error: ${error}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }
}
