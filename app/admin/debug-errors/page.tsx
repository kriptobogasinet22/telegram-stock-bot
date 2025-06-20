"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function DebugErrorsPage() {
  const [channelId, setChannelId] = useState("")
  const [testMessage, setTestMessage] = useState("Test duyuru")
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testCreateInvite = async () => {
    if (!channelId) {
      alert("Kanal ID girin!")
      return
    }

    setLoading(true)
    try {
      console.log("🔗 Testing create invite with channel:", channelId)

      const response = await fetch("/api/admin/create-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: channelId }),
      })

      const data = await response.json()

      console.log("Create invite response:", {
        status: response.status,
        ok: response.ok,
        data: data,
      })

      setResults((prev: any) => ({
        ...prev,
        createInvite: {
          status: response.status,
          ok: response.ok,
          data: data,
          timestamp: new Date().toISOString(),
        },
      }))

      if (response.ok) {
        alert(`✅ Davet linki oluşturuldu!\n${data.invite_link}`)
      } else {
        alert(`❌ Hata: ${data.error || "Bilinmeyen hata"}`)
      }
    } catch (error) {
      console.error("Create invite error:", error)
      alert(`❌ Network Error: ${error}`)
      setResults((prev: any) => ({
        ...prev,
        createInvite: {
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setLoading(false)
    }
  }

  const testAnnouncement = async () => {
    if (!testMessage.trim()) {
      alert("Test mesajı girin!")
      return
    }

    setLoading(true)
    try {
      console.log("📢 Testing announcement with message:", testMessage)

      const response = await fetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testMessage }),
      })

      const data = await response.json()

      console.log("Announcement response:", {
        status: response.status,
        ok: response.ok,
        data: data,
      })

      setResults((prev: any) => ({
        ...prev,
        announcement: {
          status: response.status,
          ok: response.ok,
          data: data,
          timestamp: new Date().toISOString(),
        },
      }))

      if (response.ok) {
        alert(`✅ Duyuru gönderildi!\nBaşarılı: ${data.sent}\nBaşarısız: ${data.failed || 0}\nToplam: ${data.total}`)
      } else {
        alert(`❌ Hata: ${data.error || "Bilinmeyen hata"}`)
      }
    } catch (error) {
      console.error("Announcement error:", error)
      alert(`❌ Network Error: ${error}`)
      setResults((prev: any) => ({
        ...prev,
        announcement: {
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setLoading(false)
    }
  }

  const testBotToken = async () => {
    setLoading(true)
    try {
      console.log("🤖 Testing bot token...")

      const response = await fetch("/api/webhook")
      const data = await response.json()

      console.log("Bot token test response:", data)

      setResults((prev: any) => ({
        ...prev,
        botToken: {
          status: response.status,
          ok: response.ok,
          data: data,
          timestamp: new Date().toISOString(),
        },
      }))

      if (data.botToken === "✅ Token Set") {
        alert("✅ Bot token doğru ayarlanmış!")
      } else {
        alert("❌ Bot token problemi var!")
      }
    } catch (error) {
      console.error("Bot token test error:", error)
      setResults((prev: any) => ({
        ...prev,
        botToken: {
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setLoading(false)
    }
  }

  const testTelegramAPI = async () => {
    if (!channelId) {
      alert("Kanal ID girin!")
      return
    }

    setLoading(true)
    try {
      console.log("📱 Testing Telegram API directly...")

      const response = await fetch("/api/get-chat-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatUsername: channelId }),
      })

      const data = await response.json()

      console.log("Telegram API test response:", data)

      setResults((prev: any) => ({
        ...prev,
        telegramAPI: {
          status: response.status,
          ok: response.ok,
          data: data,
          timestamp: new Date().toISOString(),
        },
      }))

      if (response.ok) {
        alert(`✅ Telegram API çalışıyor!\nKanal: ${data.title}\nID: ${data.id}`)
      } else {
        alert(`❌ Telegram API Hatası: ${data.error}`)
      }
    } catch (error) {
      console.error("Telegram API test error:", error)
      setResults((prev: any) => ({
        ...prev,
        telegramAPI: {
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🐛 Hata Debug Paneli</CardTitle>
          <CardDescription>Duyuru ve davet linki sorunlarını tespit edin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="channel-id">Kanal ID veya Kullanıcı Adı</Label>
              <Input
                id="channel-id"
                placeholder="-1001234567890 veya @channel"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-message">Test Duyuru Mesajı</Label>
              <Input id="test-message" value={testMessage} onChange={(e) => setTestMessage(e.target.value)} />
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button onClick={testBotToken} disabled={loading} variant="outline">
              🤖 Bot Token
            </Button>
            <Button onClick={testTelegramAPI} disabled={loading} variant="outline">
              📱 Telegram API
            </Button>
            <Button onClick={testCreateInvite} disabled={loading} variant="outline">
              🔗 Davet Linki
            </Button>
            <Button onClick={testAnnouncement} disabled={loading} variant="outline">
              📢 Duyuru
            </Button>
          </div>

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📊 Test Sonuçları:</h3>

              {/* Bot Token Test */}
              {results.botToken && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">🤖 Bot Token Test:</span>
                    <Badge variant={results.botToken.ok ? "default" : "destructive"}>
                      {results.botToken.ok ? "✅ OK" : "❌ FAIL"} ({results.botToken.status})
                    </Badge>
                  </div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(results.botToken.data || results.botToken.error, null, 2)}
                  </pre>
                </div>
              )}

              {/* Telegram API Test */}
              {results.telegramAPI && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">📱 Telegram API Test:</span>
                    <Badge variant={results.telegramAPI.ok ? "default" : "destructive"}>
                      {results.telegramAPI.ok ? "✅ OK" : "❌ FAIL"} ({results.telegramAPI.status})
                    </Badge>
                  </div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(results.telegramAPI.data || results.telegramAPI.error, null, 2)}
                  </pre>
                </div>
              )}

              {/* Create Invite Test */}
              {results.createInvite && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">🔗 Davet Linki Test:</span>
                    <Badge variant={results.createInvite.ok ? "default" : "destructive"}>
                      {results.createInvite.ok ? "✅ OK" : "❌ FAIL"} ({results.createInvite.status})
                    </Badge>
                  </div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(results.createInvite.data || results.createInvite.error, null, 2)}
                  </pre>
                </div>
              )}

              {/* Announcement Test */}
              {results.announcement && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">📢 Duyuru Test:</span>
                    <Badge variant={results.announcement.ok ? "default" : "destructive"}>
                      {results.announcement.ok ? "✅ OK" : "❌ FAIL"} ({results.announcement.status})
                    </Badge>
                  </div>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(results.announcement.data || results.announcement.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">🔧 Test Adımları:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. 🤖 Bot Token testini çalıştırın</li>
              <li>2. 📱 Kanal ID girin ve Telegram API testini çalıştırın</li>
              <li>3. 🔗 Davet linki testini çalıştırın</li>
              <li>4. 📢 Duyuru testini çalıştırın</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
