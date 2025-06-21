"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugCSSPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testCSS = async (testName: string, url: string) => {
    setLoading(true)
    try {
      console.log(`🧪 Testing: ${url}`)

      const response = await fetch(url)
      console.log(`📡 Response: ${response.status}`)

      const success = response.ok && response.headers.get("content-type")?.includes("image")

      setResults((prev: any) => ({
        ...prev,
        [testName]: {
          status: success ? "✅ SUCCESS" : "❌ FAILED",
          statusCode: response.status,
          contentType: response.headers.get("content-type"),
          url: url,
        },
      }))

      if (success) {
        alert(`✅ ${testName} çalışıyor!`)
        window.open(url, "_blank")
      } else {
        alert(`❌ ${testName} failed: ${response.status}`)
      }
    } catch (error) {
      console.error(`${testName} error:`, error)
      alert(`❌ ${testName} error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🎨 CSS Property Debug</CardTitle>
          <CardDescription>Hangi CSS property sorun çıkarıyor bul</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button onClick={() => testCSS("CSS1", "/api/debug-css1")} disabled={loading} variant="outline">
              🧪 CSS1: Padding
            </Button>
            <Button onClick={() => testCSS("CSS2", "/api/debug-css2")} disabled={loading} variant="outline">
              📊 CSS2: Margin
            </Button>
            <Button onClick={() => testCSS("CSS3", "/api/debug-css3")} disabled={loading} variant="outline">
              🎨 CSS3: Nested BG
            </Button>
            <Button onClick={() => testCSS("CSS4", "/api/debug-css4")} disabled={loading} variant="outline">
              🔄 CSS4: Border Radius
            </Button>
            <Button
              onClick={() => testCSS("Minimal", "/api/debug-minimal-depth?symbol=THYAO&price=25.50")}
              disabled={loading}
            >
              ✅ Minimal Depth
            </Button>
          </div>

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📊 CSS Test Sonuçları:</h3>

              {Object.entries(results).map(([key, result]: [string, any]) => (
                <div key={key} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">🎨 {key.toUpperCase()}:</span>
                    <span className={result.status?.includes("✅") ? "text-green-600" : "text-red-600"}>
                      {result.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>URL: {result.url}</div>
                    {result.statusCode && <div>Status: {result.statusCode}</div>}
                    {result.contentType && <div>Type: {result.contentType}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Direct Links */}
          <div className="p-4 bg-gray-50 border rounded-lg">
            <h4 className="font-medium mb-2">🔗 Direct CSS Test Links:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>CSS1 (Padding):</strong>{" "}
                <a href="/api/debug-css1" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                  /api/debug-css1
                </a>
              </div>
              <div>
                <strong>CSS2 (Margin):</strong>{" "}
                <a href="/api/debug-css2" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                  /api/debug-css2
                </a>
              </div>
              <div>
                <strong>CSS3 (Nested BG):</strong>{" "}
                <a href="/api/debug-css3" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                  /api/debug-css3
                </a>
              </div>
              <div>
                <strong>CSS4 (Border Radius):</strong>{" "}
                <a href="/api/debug-css4" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                  /api/debug-css4
                </a>
              </div>
              <div>
                <strong>Minimal Depth:</strong>{" "}
                <a
                  href="/api/debug-minimal-depth?symbol=THYAO&price=25.50"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                  rel="noreferrer"
                >
                  /api/debug-minimal-depth?symbol=THYAO&price=25.50
                </a>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🔧 CSS Debug:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. 🧪 CSS1: Root div'de padding sorun çıkarıyor mu?</li>
              <li>2. 📊 CSS2: marginBottom sorun çıkarıyor mu?</li>
              <li>3. 🎨 CSS3: Nested backgroundColor sorun çıkarıyor mu?</li>
              <li>4. 🔄 CSS4: borderRadius sorun çıkarıyor mu?</li>
              <li>5. ✅ Minimal: Sadece çalışan CSS ile depth chart</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
