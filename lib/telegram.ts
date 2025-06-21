interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
}

interface TelegramMessage {
  message_id: number
  from?: TelegramUser
  chat: {
    id: number
    type: string
  }
  text?: string
  date: number
}

interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  callback_query?: {
    id: string
    from: TelegramUser
    message?: TelegramMessage
    data?: string
  }
  chat_join_request?: {
    chat: {
      id: number
      title: string
      type: string
    }
    from: TelegramUser
    date: number
    bio?: string
    invite_link?: {
      invite_link: string
    }
  }
  chat_member?: {
    chat: {
      id: number
      title: string
      type: string
    }
    from: TelegramUser
    date: number
    old_chat_member: {
      user: TelegramUser
      status: string
    }
    new_chat_member: {
      user: TelegramUser
      status: string
    }
  }
}

export class TelegramBot {
  private token: string
  private baseUrl: string

  constructor(token: string) {
    this.token = token
    this.baseUrl = `https://api.telegram.org/bot${token}`
  }

  async sendMessage(chatId: number | string, text: string, options: any = {}) {
    try {
      console.log(`Sending message to ${chatId}: ${text.substring(0, 50)}...`)

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          ...options,
        }),
      })

      const result = await response.json()

      if (!result.ok) {
        console.error(`Failed to send message to ${chatId}:`, result.description)
      }

      return result
    } catch (error) {
      console.error(`Error sending message to ${chatId}:`, error)
      throw error
    }
  }

  async sendPhoto(chatId: number | string, photo: Buffer, options: any = {}) {
    try {
      console.log(`Sending photo to ${chatId}`)

      const formData = new FormData()
      formData.append("chat_id", chatId.toString())
      formData.append("photo", new Blob([photo], { type: "image/png" }), "depth_chart.png")

      if (options.caption) {
        formData.append("caption", options.caption)
      }
      if (options.parse_mode) {
        formData.append("parse_mode", options.parse_mode)
      }

      const response = await fetch(`${this.baseUrl}/sendPhoto`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!result.ok) {
        console.error(`Failed to send photo to ${chatId}:`, result.description)
      }

      return result
    } catch (error) {
      console.error(`Error sending photo to ${chatId}:`, error)
      throw error
    }
  }

  async sendDocument(chatId: number | string, document: Buffer, options: any = {}) {
    try {
      console.log(`Sending document to ${chatId}`)

      const formData = new FormData()
      formData.append("chat_id", chatId.toString())
      formData.append("document", new Blob([document], { type: "image/svg+xml" }), options.filename || "document.svg")

      if (options.caption) {
        formData.append("caption", options.caption)
      }
      if (options.parse_mode) {
        formData.append("parse_mode", options.parse_mode)
      }

      const response = await fetch(`${this.baseUrl}/sendDocument`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!result.ok) {
        console.error(`Failed to send document to ${chatId}:`, result.description)
      }

      return result
    } catch (error) {
      console.error(`Error sending document to ${chatId}:`, error)
      throw error
    }
  }

  async editMessageText(chatId: number | string, messageId: number, text: string, options: any = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/editMessageText`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text,
          parse_mode: "HTML",
          ...options,
        }),
      })

      return await response.json()
    } catch (error) {
      console.error(`Error editing message ${messageId} in chat ${chatId}:`, error)
      throw error
    }
  }

  async deleteMessage(chatId: number | string, messageId: number) {
    try {
      const response = await fetch(`${this.baseUrl}/deleteMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
        }),
      })

      return await response.json()
    } catch (error) {
      console.error(`Error deleting message ${messageId} in chat ${chatId}:`, error)
      throw error
    }
  }

  async getChatMember(chatId: string | number, userId: number) {
    try {
      const response = await fetch(`${this.baseUrl}/getChatMember`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          user_id: userId,
        }),
      })

      return await response.json()
    } catch (error) {
      console.error(`Error getting chat member ${userId} in chat ${chatId}:`, error)
      return { ok: false, description: "Network error" }
    }
  }

  async getChat(chatId: string | number) {
    try {
      const response = await fetch(`${this.baseUrl}/getChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
        }),
      })

      return await response.json()
    } catch (error) {
      console.error(`Error getting chat ${chatId}:`, error)
      return { ok: false, description: "Network error" }
    }
  }

  async answerCallbackQuery(callbackQueryId: string, text?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/answerCallbackQuery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text,
          show_alert: false,
        }),
      })

      return await response.json()
    } catch (error) {
      console.error(`Error answering callback query ${callbackQueryId}:`, error)
      return { ok: false, description: "Network error" }
    }
  }

  // Katılma isteğini onaylama
  async approveChatJoinRequest(chatId: number | string, userId: number) {
    try {
      console.log(`Approving join request for user ${userId} in chat ${chatId}`)

      const response = await fetch(`${this.baseUrl}/approveChatJoinRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          user_id: userId,
        }),
      })

      const result = await response.json()

      if (!result.ok) {
        console.error(`Failed to approve join request for user ${userId} in chat ${chatId}:`, result.description)
      }

      return result
    } catch (error) {
      console.error(`Error approving join request for user ${userId} in chat ${chatId}:`, error)
      return { ok: false, description: "Network error" }
    }
  }

  // Katılma isteğini reddetme
  async declineChatJoinRequest(chatId: number | string, userId: number) {
    try {
      const response = await fetch(`${this.baseUrl}/declineChatJoinRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          user_id: userId,
        }),
      })

      return await response.json()
    } catch (error) {
      console.error(`Error declining join request for user ${userId} in chat ${chatId}:`, error)
      return { ok: false, description: "Network error" }
    }
  }

  // Davet linki oluşturma
  async createChatInviteLink(chatId: number | string, name = "Bot Users") {
    try {
      console.log(`Creating invite link for chat ${chatId}`)

      const response = await fetch(`${this.baseUrl}/createChatInviteLink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          name,
          creates_join_request: true, // Join request oluşturacak
        }),
      })

      const result = await response.json()

      if (!result.ok) {
        console.error(`Failed to create invite link for chat ${chatId}:`, result.description)
      } else {
        console.log(`Successfully created invite link for chat ${chatId}:`, result.result.invite_link)
      }

      return result
    } catch (error) {
      console.error(`Error creating invite link for chat ${chatId}:`, error)
      return { ok: false, description: "Network error" }
    }
  }

  // Webhook ayarları - join request eventlerini almak için
  async setWebhook(url: string) {
    try {
      console.log(`Setting webhook to ${url}`)

      const response = await fetch(`${this.baseUrl}/setWebhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          allowed_updates: ["message", "callback_query", "chat_join_request", "chat_member"],
        }),
      })

      const result = await response.json()

      if (!result.ok) {
        console.error(`Failed to set webhook:`, result.description)
      } else {
        console.log(`Successfully set webhook to ${url}`)
      }

      return result
    } catch (error) {
      console.error(`Error setting webhook:`, error)
      return { ok: false, description: "Network error" }
    }
  }

  // Webhook bilgisi alma
  async getWebhookInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/getWebhookInfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      return await response.json()
    } catch (error) {
      console.error(`Error getting webhook info:`, error)
      return { ok: false, description: "Network error" }
    }
  }
}

export type { TelegramUpdate, TelegramMessage, TelegramUser }
