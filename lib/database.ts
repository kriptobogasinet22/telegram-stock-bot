import { createClient } from "@supabase/supabase-js"

// Singleton pattern for Supabase client
const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Supabase credentials missing!")
  }

  return createClient(supabaseUrl, supabaseKey)
}

export interface User {
  id: number
  username?: string
  first_name?: string
  last_name?: string
  is_member: boolean
  created_at: string
  updated_at: string
}

export interface UserFavorite {
  id: number
  user_id: number
  stock_code: string
  created_at: string
}

export interface Setting {
  id: number
  key: string
  value: string
  updated_at: string
}

export interface JoinRequest {
  id: number
  user_id: number
  chat_id: number
  username?: string
  first_name?: string
  last_name?: string
  bio?: string
  status: "pending" | "approved" | "declined"
  requested_at: string
  processed_at?: string
  processed_by?: number
}

export class Database {
  static async getUser(userId: number): Promise<User | null> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        console.error(`Error getting user ${userId}:`, error)
        return null
      }

      return data
    } catch (error) {
      console.error(`Exception getting user ${userId}:`, error)
      return null
    }
  }

  static async createOrUpdateUser(userData: Partial<User>): Promise<User | null> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("users")
        .upsert({
          id: userData.id,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          is_member: userData.is_member || false,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error(`Error creating/updating user:`, error)
        return null
      }

      return data
    } catch (error) {
      console.error(`Exception creating/updating user:`, error)
      return null
    }
  }

  static async updateUserMembership(userId: number, isMember: boolean): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("users")
        .update({
          is_member: isMember,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        console.error(`Error updating user membership for ${userId}:`, error)
        return false
      }

      return true
    } catch (error) {
      console.error(`Exception updating user membership for ${userId}:`, error)
      return false
    }
  }

  static async getSetting(key: string): Promise<string | null> {
    try {
      console.log(`Getting setting: ${key}`)
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("settings").select("value").eq("key", key).single()

      if (error) {
        console.error(`Error getting setting ${key}:`, error)
        return null
      }

      console.log(`Setting ${key} value:`, data?.value)
      return data?.value || null
    } catch (error) {
      console.error(`Exception getting setting ${key}:`, error)
      return null
    }
  }

  static async updateSetting(key: string, value: string): Promise<boolean> {
    try {
      console.log(`Updating setting: ${key} = ${value}`)
      const supabase = getSupabaseClient()

      const { error } = await supabase.from("settings").upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "key",
        },
      )

      if (error) {
        console.error(`Error updating setting ${key}:`, error)
        return false
      }

      console.log(`Successfully updated setting ${key}`)
      return true
    } catch (error) {
      console.error(`Exception updating setting ${key}:`, error)
      return false
    }
  }

  static async getUserFavorites(userId: number): Promise<UserFavorite[]> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error(`Error getting favorites for user ${userId}:`, error)
        return []
      }

      return data || []
    } catch (error) {
      console.error(`Exception getting favorites for user ${userId}:`, error)
      return []
    }
  }

  static async addUserFavorite(userId: number, stockCode: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("user_favorites").insert({
        user_id: userId,
        stock_code: stockCode.toUpperCase(),
      })

      if (error && !error.message.includes("duplicate")) {
        console.error(`Error adding favorite for user ${userId}:`, error)
        return false
      }

      return true
    } catch (error) {
      console.error(`Exception adding favorite for user ${userId}:`, error)
      return false
    }
  }

  static async removeUserFavorite(userId: number, stockCode: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("stock_code", stockCode.toUpperCase())

      if (error) {
        console.error(`Error removing favorite for user ${userId}:`, error)
        return false
      }

      return true
    } catch (error) {
      console.error(`Exception removing favorite for user ${userId}:`, error)
      return false
    }
  }

  static async clearUserFavorites(userId: number): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("user_favorites").delete().eq("user_id", userId)

      if (error) {
        console.error(`Error clearing favorites for user ${userId}:`, error)
        return false
      }

      return true
    } catch (error) {
      console.error(`Exception clearing favorites for user ${userId}:`, error)
      return false
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error getting all users:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception getting all users:", error)
      return []
    }
  }

  static async isAdmin(userId: number): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("admin_users").select("id").eq("user_id", userId).single()

      if (error) {
        return false
      }

      return data !== null
    } catch (error) {
      console.error(`Exception checking admin status for user ${userId}:`, error)
      return false
    }
  }

  // Join request methods
  static async createJoinRequest(requestData: Partial<JoinRequest>): Promise<JoinRequest | null> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("join_requests")
        .upsert({
          user_id: requestData.user_id,
          chat_id: requestData.chat_id,
          username: requestData.username,
          first_name: requestData.first_name,
          last_name: requestData.last_name,
          bio: requestData.bio,
          status: "pending",
          requested_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating join request:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Exception creating join request:", error)
      return null
    }
  }

  static async getJoinRequest(userId: number, chatId: number): Promise<JoinRequest | null> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("join_requests")
        .select("*")
        .eq("user_id", userId)
        .eq("chat_id", chatId)
        .single()

      if (error) {
        console.error(`Error getting join request for user ${userId} in chat ${chatId}:`, error)
        return null
      }

      return data
    } catch (error) {
      console.error(`Exception getting join request for user ${userId} in chat ${chatId}:`, error)
      return null
    }
  }

  static async updateJoinRequestStatus(
    userId: number,
    chatId: number,
    status: "approved" | "declined",
    processedBy?: number,
  ): Promise<boolean> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("join_requests")
        .update({
          status,
          processed_at: new Date().toISOString(),
          processed_by: processedBy,
        })
        .eq("user_id", userId)
        .eq("chat_id", chatId)

      if (error) {
        console.error(`Error updating join request status for user ${userId} in chat ${chatId}:`, error)
        return false
      }

      return true
    } catch (error) {
      console.error(`Exception updating join request status for user ${userId} in chat ${chatId}:`, error)
      return false
    }
  }

  static async getPendingJoinRequests(): Promise<JoinRequest[]> {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("join_requests")
        .select("*")
        .eq("status", "pending")
        .order("requested_at", { ascending: false })

      if (error) {
        console.error("Error getting pending join requests:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Exception getting pending join requests:", error)
      return []
    }
  }
}
