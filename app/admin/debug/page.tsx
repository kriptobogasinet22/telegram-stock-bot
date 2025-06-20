"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DebugPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Debug error:", error)
    }
    setLoading(false)
  }

  const testDatabase = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      console.log("Database test:", data)
      alert(`Database bağlantısı OK! ${data.users?.length || 0} kullanıcı bulundu.`)
    } catch (error) {
      console.error("Database test error:", error)
      alert("Database bağlantısı HATA!")
    }
  }

  useEffect(() => {
    testSettings()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug Panel</CardTitle>
          <CardDescription>Sistem durumunu kontrol edin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={testSettings} disabled={loading}>
              {loading ? "Test Ediliyor..." : "Ayarları Test Et"}
            </Button>
            <Button onClick={testDatabase} variant="outline">
              Database Test Et
            </Button>
          </div>

          {settings && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📊 Mevcut Ayarlar:</h3>

              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Ana Kanal Linki:</span>
                    <Badge variant={settings.settings?.main_channel_link ? "default" : "destructive"}>
                      {settings.settings?.main_channel_link || "Ayarlanmamış"}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Ana Kanal ID:</span>
                    <Badge variant={settings.settings?.main_channel_id ? "default" : "destructive"}>
                      {settings.settings?.main_channel_id || "Ayarlanmamış"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">🔧 Raw Data:</h4>
                <pre className="text-xs overflow-auto">{JSON.stringify(settings, null, 2)}</pre>
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">💡 Kontrol Listesi:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Supabase bağlantısı çalışıyor mu?</li>
              <li>✅ Settings tablosu var mı?</li>
              <li>✅ API route'ları çalışıyor mu?</li>
              <li>✅ Environment variables set mi?</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
