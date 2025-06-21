export const runtime = "edge"

// Edge runtime ama ImageResponse yok
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "✅ Edge Runtime Working",
      timestamp: new Date().toISOString(),
      message: "Edge runtime çalışıyor ama ImageResponse test edilmedi",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  )
}
