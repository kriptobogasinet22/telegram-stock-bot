import { NextResponse } from "next/server"

// NORMAL runtime - edge değil
export async function GET() {
  return NextResponse.json({
    status: "✅ Normal API Route Working",
    timestamp: new Date().toISOString(),
    message: "Bu çalışıyorsa problem Edge Runtime'da",
  })
}
