export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string | null
          id: number
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          friend_id?: string | null
          id?: never
          status: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          friend_id?: string | null
          id?: never
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          id: number
          rank: number | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          id?: never
          rank?: number | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          id?: never
          rank?: number | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string | null
          id: number
          location: string | null
          match_date: string | null
          player1_id: string | null
          player2_id: string | null
          player3_id: number | null
          player4_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          location?: string | null
          match_date?: string | null
          player1_id?: string | null
          player2_id?: string | null
          player3_id?: number | null
          player4_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          location?: string | null
          match_date?: string | null
          player1_id?: string | null
          player2_id?: string | null
          player3_id?: number | null
          player4_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          country: string
          created_at: string | null
          date_of_birth: string | null
          display_name: string
          gender: string | null
          id: string
          languages: string[] | null
          location: string | null
          preferred_language: string | null
          profile_photo: string | null
          user_id: string | null
          whatsapp_number: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          date_of_birth?: string | null
          display_name: string
          gender?: string | null
          id?: string
          languages?: string[] | null
          location?: string | null
          preferred_language?: string | null
          profile_photo?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          date_of_birth?: string | null
          display_name?: string
          gender?: string | null
          id?: string
          languages?: string[] | null
          location?: string | null
          preferred_language?: string | null
          profile_photo?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          created_at: string | null
          id: number
          player_id: string | null
          rating: number
        }
        Insert: {
          created_at?: string | null
          id?: never
          player_id?: string | null
          rating: number
        }
        Update: {
          created_at?: string | null
          id?: never
          player_id?: string | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
