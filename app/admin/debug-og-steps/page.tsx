"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugOGStepsPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testStep = async (step: number, params = "") => {
    setLoading(true)
    try {
      const url = `/api/debug-step${step}${params}`
      console.log(`🧪 Testing: ${url}`)

      const response = await fetch(url)
      console.log(`📡 Response: ${response.status}`)

      const success = response.ok && response.headers.get("content-type")?.includes("image")

      setResults((prev: any) => ({
        ...prev,
        [`step${step}`]: {
          status: success ? "✅ SUCCESS" : "❌ FAILED",
          statusCode: response.status,
          contentType: response.headers.get("content-type"),
          url: url,
        },
      }))

      if (success) {
        alert(`✅ Step ${step} çalışıyor!`)
        // Yeni sekmede aç
        window.open(url, "_blank")
      } else {
        const text = await response.text()
        alert(`❌ Step ${step} failed: ${response.status}\n${text.substring(0, 100)}`)
      }
    } catch (error) {
      console.error(`Step ${step} error:`, error)
      setResults((prev: any) => ({
        ...prev,
        [`step${step}`]: {
          status: "❌ ERROR",
          error: String(error),
          url: `/api/debug-step${step}${params}`,
        },
      }))
      alert(`❌ Step ${step} error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔍 OG Debug Steps</CardTitle>
          <CardDescription>Adım adım OG sorununu tespit et</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => testStep(1)} disabled={loading} variant="outline">
              🧪 Step 1: Basic
            </Button>
            <Button onClick={() => testStep(2, "?symbol=THYAO")} disabled={loading} variant="outline">
              📊 Step 2: Params
            </Button>
            <Button onClick={() => testStep(3, "?symbol=THYAO")} disabled={loading} variant="outline">
              🔄 Step 3: Array
            </Button>
            <Button onClick={() => testStep(4, "?symbol=THYAO&price=25.50")} disabled={loading}>
              🎨 Step 4: Layout
            </Button>
          </div>

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📊 Test Sonuçları:</h3>

              {Object.entries(results).map(([key, result]: [string, any]) => (
                <div key={key} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">🧪 {key.toUpperCase()}:</span>
                    <span className={result.status?.includes("✅") ? "text-green-600" : "text-red-600"}>
                      {result.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>URL: {result.url}</div>
                    {result.statusCode && <div>Status: {result.statusCode}</div>}
                    {result.contentType && <div>Type: {result.contentType}</div>}
                    {result.error && <div>Error: {result.error}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🔧 Debug Adımları:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. 🧪 Step 1: En basit OG test</li>
              <li>2. 📊 Step 2: Query parameters test</li>
              <li>3. 🔄 Step 3: Array rendering test</li>
              <li>4. 🎨 Step 4: Complex layout test</li>
              <li>5. ❌ Hangi adımda fail olursa orada sorun var</li>
            </ol>
          </div>

          {/* Direct Links */}
          <div className="p-4 bg-gray-50 border rounded-lg">
            <h4 className="font-medium mb-2">🔗 Direct Test Links:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Step 1:</strong>{" "}
                <a href="/api/debug-step1" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                  /api/debug-step1
                </a>
              </div>
              <div>
                <strong>Step 2:</strong>{" "}
                <a
                  href="/api/debug-step2?symbol=THYAO"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                  rel="noreferrer"
                >
                  /api/debug-step2?symbol=THYAO
                </a>
              </div>
              <div>
                <strong>Step 3:</strong>{" "}
                <a
                  href="/api/debug-step3?symbol=THYAO"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                  rel="noreferrer"
                >
                  /api/debug-step3?symbol=THYAO
                </a>
              </div>
              <div>
                <strong>Step 4:</strong>{" "}
                <a
                  href="/api/debug-step4?symbol=THYAO&price=25.50"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                  rel="noreferrer"
                >
                  /api/debug-step4?symbol=THYAO&price=25.50
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
