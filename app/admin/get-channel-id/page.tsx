"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Search, Lock, AlertCircle } from "lucide-react"

export default function GetChannelIdPage() {
  const [username, setUsername] = useState("")
  const [chatInfo, setChatInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const getChatInfo = async () => {
    if (!username.trim()) {
      setError("Kanal kullanıcı adını veya ID'sini girin")
      return
    }

    setLoading(true)
    setError("")
    setChatInfo(null)

    try {
      const response = await fetch("/api/get-chat-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatUsername: username }),
      })

      const result = await response.json()

      if (response.ok) {
        setChatInfo(result)
      } else {
        setError(result.error || "Kanal bilgisi alınamadı")
      }
    } catch (error) {
      setError("Bir hata oluştu")
    }

    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Kopyalandı!")
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-6 h-6" />
            Private Kanal ID Öğren
          </CardTitle>
          <CardDescription>Private kanal ID'sini öğrenmek için kanal bilgilerini sorgulayın</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Private Channel Info */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-800 mb-1">Private Kanal Hakkında</h4>
                <p className="text-sm text-purple-700">
                  Private kanalların kullanıcı adı (@username) olmaz. Bu nedenle sadece kanal ID'si ile çalışırız.
                  Botunuzun kanala admin olarak eklenmiş olması gerekir.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Kanal Kullanıcı Adı veya ID</Label>
            <Input
              id="username"
              placeholder="@your_channel veya -1001234567890"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && getChatInfo()}
            />
            <p className="text-xs text-gray-500">
              Public kanal için @username, private kanal için -1001234567890 formatında ID girin
            </p>
          </div>

          <Button onClick={getChatInfo} disabled={loading} className="w-full">
            {loading ? "Sorgulanıyor..." : "Kanal Bilgilerini Öğren"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 mb-1">❌ Hata</h4>
                  <p className="text-sm text-red-700">{error}</p>
                  <p className="text-xs text-red-600 mt-2">Bot'un kanala admin olarak eklendiğinden emin olun.</p>
                </div>
              </div>
            </div>
          )}

          {chatInfo && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
              <h3 className="font-semibold text-green-800">✅ Kanal Bilgileri:</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <strong>Kanal ID:</strong> {chatInfo.id}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(chatInfo.id.toString())}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <strong>Kanal Adı:</strong> {chatInfo.title}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(chatInfo.title)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {chatInfo.username ? (
                  <div className="p-2 bg-white rounded border">
                    <strong>Kullanıcı Adı:</strong> @{chatInfo.username}
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Public Kanal</span>
                  </div>
                ) : (
                  <div className="p-2 bg-white rounded border">
                    <strong>Kanal Tipi:</strong> Private Kanal (Kullanıcı adı yok)
                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Private</span>
                  </div>
                )}

                <div className="p-2 bg-white rounded border">
                  <strong>Tip:</strong> {chatInfo.type}
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-700">
                  💡 <strong>Not:</strong> Bu ID'yi admin panelinde "Private Kanal ID" alanına yapıştırın.
                </p>
              </div>

              {!chatInfo.username && (
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded">
                  <p className="text-sm text-purple-700">
                    🔒 <strong>Private Kanal:</strong> Bu kanal private olduğu için kullanıcı adı yok. Sadece ID ile
                    çalışır.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📋 Adımlar:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Telegram'da private kanal oluşturun</li>
              <li>2. Bot'u kanala admin olarak ekleyin</li>
              <li>3. Kanal ID'sini buradan öğrenin</li>
              <li>4. Admin panelinde ayarları yapın</li>
              <li>5. Davet linki oluşturun</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
