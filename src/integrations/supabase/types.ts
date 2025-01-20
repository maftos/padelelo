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
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          location: string | null
          match_date: string | null
          match_id: string
          status: Database["public"]["Enums"]["match_status"] | null
          team1_player1_id: string | null
          team1_player2_id: string | null
          team1_score: number | null
          team2_player1_id: string | null
          team2_player2_id: string | null
          team2_score: number | null
          updated_at: string | null
          winner_team: number | null
        }
        Insert: {
          created_at?: string | null
          location?: string | null
          match_date?: string | null
          match_id?: string
          status?: Database["public"]["Enums"]["match_status"] | null
          team1_player1_id?: string | null
          team1_player2_id?: string | null
          team1_score?: number | null
          team2_player1_id?: string | null
          team2_player2_id?: string | null
          team2_score?: number | null
          updated_at?: string | null
          winner_team?: number | null
        }
        Update: {
          created_at?: string | null
          location?: string | null
          match_date?: string | null
          match_id?: string
          status?: Database["public"]["Enums"]["match_status"] | null
          team1_player1_id?: string | null
          team1_player2_id?: string | null
          team1_score?: number | null
          team2_player1_id?: string | null
          team2_player2_id?: string | null
          team2_score?: number | null
          updated_at?: string | null
          winner_team?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["team1_player1_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["team1_player2_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player3_id_fkey"
            columns: ["team2_player1_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player4_id_fkey"
            columns: ["team2_player2_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings_history: {
        Row: {
          change_amount: number
          change_type: string
          created_at: string | null
          id: number
          match_id: string | null
          new_mmr: number
          old_mmr: number
          partner_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          change_amount: number
          change_type: string
          created_at?: string | null
          id?: never
          match_id?: string | null
          new_mmr: number
          old_mmr: number
          partner_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          change_amount?: number
          change_type?: string
          created_at?: string | null
          id?: never
          match_id?: string | null
          new_mmr?: number
          old_mmr?: number
          partner_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_history_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "ratings_history_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      release_notes: {
        Row: {
          change_items: string[]
          created_at: string | null
          id: number
          release_date: string
          status: string
          title: string
        }
        Insert: {
          change_items: string[]
          created_at?: string | null
          id?: never
          release_date: string
          status: string
          title: string
        }
        Update: {
          change_items?: string[]
          created_at?: string | null
          id?: never
          release_date?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          created_at: string
          id: number
          name: string
          suggestion: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          suggestion: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          suggestion?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          current_mmr: number | null
          date_of_birth: string | null
          display_name: string
          gender: string | null
          id: string
          languages: string[] | null
          location: string | null
          nationality: string | null
          preferred_language: string | null
          profile_photo: string | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string | null
          current_mmr?: number | null
          date_of_birth?: string | null
          display_name: string
          gender?: string | null
          id?: string
          languages?: string[] | null
          location?: string | null
          nationality?: string | null
          preferred_language?: string | null
          profile_photo?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string | null
          current_mmr?: number | null
          date_of_birth?: string | null
          display_name?: string
          gender?: string | null
          id?: string
          languages?: string[] | null
          location?: string | null
          nationality?: string | null
          preferred_language?: string | null
          profile_photo?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_mmr_change: {
        Args: {
          match_id: string
        }
        Returns: {
          team1_avg_mmr: number
          team2_avg_mmr: number
          team1_expected_win_rate: number
          team2_expected_win_rate: number
          team1_win_mmr_change_amount: number
          team2_win_mmr_change_amount: number
        }[]
      }
      get_user_friends: {
        Args: {
          user_id: string
        }
        Returns: {
          friend_id: string
          status: string
          created_at: string
        }[]
      }
      post_match: {
        Args: {
          match_id: string
        }
        Returns: {
          team1_avg_mmr: number
          team2_avg_mmr: number
          team1_expected_win_rate: number
          team2_expected_win_rate: number
          team1_win_mmr_change_amount: number
          team2_win_mmr_change_amount: number
        }[]
      }
      view_my_friends: {
        Args: {
          user_id: string
        }
        Returns: {
          friend_id: string
          status: string
          created_at: string
          display_name: string
        }[]
      }
    }
    Enums: {
      change_type: "WIN" | "LOSS" | "DRAW" | "MANUAL"
      friendship_status: "INVITED" | "CONFIRMED" | "RECEIVED" | "DELETED"
      gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY"
      match_status: "PENDING" | "COMPLETED" | "CANCELLED" | "DELETED"
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
