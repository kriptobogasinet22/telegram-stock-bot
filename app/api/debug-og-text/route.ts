export const runtime = "edge"

export async function GET() {
  try {
    // ImageResponse import test
    const { ImageResponse } = await import("next/og")

    return new Response("ImageResponse import successful", {
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error) {
    return new Response(`ImageResponse import failed: ${error}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }
}
