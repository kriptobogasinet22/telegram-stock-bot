"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestOGPage() {
  const [symbol, setSymbol] = useState("THYAO")
  const [price, setPrice] = useState("25.50")
  const [changePercent, setChangePercent] = useState("2.5")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>({})

  const testBasicOG = async () => {
    setLoading(true)
    try {
      console.log("🧪 Testing basic OG...")

      const response = await fetch("/api/test-depth")
      console.log("Basic OG Response:", response.status)

      if (response.ok) {
        setResults((prev: any) => ({
          ...prev,
          basicOG: {
            status: "✅ SUCCESS",
            statusCode: response.status,
            contentType: response.headers.get("content-type"),
          },
        }))
        alert("✅ Basic OG çalışıyor!")
      } else {
        const text = await response.text()
        setResults((prev: any) => ({
          ...prev,
          basicOG: {
            status: "❌ FAILED",
            statusCode: response.status,
            error: text.substring(0, 200),
          },
        }))
        alert(`❌ Basic OG failed: ${response.status}`)
      }
    } catch (error) {
      console.error("Basic OG error:", error)
      setResults((prev: any) => ({
        ...prev,
        basicOG: {
          status: "❌ ERROR",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }))
      alert(`❌ Basic OG error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testDepthOG = async () => {
    setLoading(true)
    try {
      console.log("🎨 Testing depth OG...")

      const params = new URLSearchParams()
      params.set("symbol", symbol)
      params.set("price", price)
      params.set("changePercent", changePercent)

      // Mock data
      const mockBids = Array.from({ length: 10 }, (_, i) => ({
        price: Number.parseFloat(price) - (i + 1) * 0.05,
        quantity: Math.floor(Math.random() * 5000) + 1000,
      }))

      const mockAsks = Array.from({ length: 10 }, (_, i) => ({
        price: Number.parseFloat(price) + (i + 1) * 0.05,
        quantity: Math.floor(Math.random() * 5000) + 1000,
      }))

      params.set("bids", encodeURIComponent(JSON.stringify(mockBids)))
      params.set("asks", encodeURIComponent(JSON.stringify(mockAsks)))

      const url = `/api/og/depth?${params.toString()}`
      console.log("Depth OG URL:", url.substring(0, 100) + "...")

      const response = await fetch(url)
      console.log("Depth OG Response:", response.status)

      if (response.ok) {
        setResults((prev: any) => ({
          ...prev,
          depthOG: {
            status: "✅ SUCCESS",
            statusCode: response.status,
            contentType: response.headers.get("content-type"),
            size: response.headers.get("content-length"),
          },
        }))
        alert("✅ Depth OG çalışıyor!")

        // Görseli yeni sekmede aç
        window.open(url, "_blank")
      } else {
        const text = await response.text()
        setResults((prev: any) => ({
          ...prev,
          depthOG: {
            status: "❌ FAILED",
            statusCode: response.status,
            error: text.substring(0, 200),
          },
        }))
        alert(`❌ Depth OG failed: ${response.status}`)
      }
    } catch (error) {
      console.error("Depth OG error:", error)
      setResults((prev: any) => ({
        ...prev,
        depthOG: {
          status: "❌ ERROR",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }))
      alert(`❌ Depth OG error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🧪 OG Image Test Panel</CardTitle>
          <CardDescription>Vercel OG Image Generation test et</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Hisse Kodu</Label>
              <Input id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Fiyat</Label>
              <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="change">Değişim %</Label>
              <Input id="change" value={changePercent} onChange={(e) => setChangePercent(e.target.value)} />
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={testBasicOG} disabled={loading} variant="outline">
              🧪 Basic OG Test
            </Button>
            <Button onClick={testDepthOG} disabled={loading}>
              🎨 Depth OG Test
            </Button>
          </div>

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📊 Test Sonuçları:</h3>

              {results.basicOG && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">🧪 Basic OG Test:</span>
                    <span className={results.basicOG.status.includes("✅") ? "text-green-600" : "text-red-600"}>
                      {results.basicOG.status}
                    </span>
                  </div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(results.basicOG, null, 2)}
                  </pre>
                </div>
              )}

              {results.depthOG && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">🎨 Depth OG Test:</span>
                    <span className={results.depthOG.status.includes("✅") ? "text-green-600" : "text-red-600"}>
                      {results.depthOG.status}
                    </span>
                  </div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                    {JSON.stringify(results.depthOG, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🔧 Test Adımları:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. 🧪 Basic OG testini çalıştır</li>
              <li>2. ✅ Basic çalışıyorsa Depth OG testini çalıştır</li>
              <li>3. 🎨 Depth OG başarılıysa yeni sekmede görsel açılır</li>
              <li>4. ❌ Hata varsa console logları kontrol et</li>
            </ol>
          </div>

          {/* Direct Links */}
          <div className="p-4 bg-gray-50 border rounded-lg">
            <h4 className="font-medium mb-2">🔗 Direct Test Links:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Basic OG:</strong>{" "}
                <a href="/api/test-depth" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                  /api/test-depth
                </a>
              </div>
              <div>
                <strong>Simple OG:</strong>{" "}
                <a
                  href="/api/og?symbol=THYAO&price=25.50"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                  rel="noreferrer"
                >
                  /api/og?symbol=THYAO&price=25.50
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
