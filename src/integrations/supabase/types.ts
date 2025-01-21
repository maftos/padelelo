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
      countries: {
        Row: {
          continent: Database["public"]["Enums"]["continents"] | null
          id: number
          iso2: string
          iso3: string | null
          local_name: string | null
          name: string | null
        }
        Insert: {
          continent?: Database["public"]["Enums"]["continents"] | null
          id?: number
          iso2: string
          iso3?: string | null
          local_name?: string | null
          name?: string | null
        }
        Update: {
          continent?: Database["public"]["Enums"]["continents"] | null
          id?: number
          iso2?: string
          iso3?: string | null
          local_name?: string | null
          name?: string | null
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string | null
          id: number
          status: Database["public"]["Enums"]["friendship_status"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          friend_id?: string | null
          id?: never
          status: Database["public"]["Enums"]["friendship_status"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          friend_id?: string | null
          id?: never
          status?: Database["public"]["Enums"]["friendship_status"]
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
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "users_sorted_by_mmr"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_sorted_by_mmr"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          location: string | null
          losers: string[] | null
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
          winners: string[] | null
        }
        Insert: {
          created_at?: string | null
          location?: string | null
          losers?: string[] | null
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
          winners?: string[] | null
        }
        Update: {
          created_at?: string | null
          location?: string | null
          losers?: string[] | null
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
          winners?: string[] | null
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
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["team1_player1_id"]
            isOneToOne: false
            referencedRelation: "users_sorted_by_mmr"
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
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["team1_player2_id"]
            isOneToOne: false
            referencedRelation: "users_sorted_by_mmr"
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
            foreignKeyName: "matches_player3_id_fkey"
            columns: ["team2_player1_id"]
            isOneToOne: false
            referencedRelation: "users_sorted_by_mmr"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player4_id_fkey"
            columns: ["team2_player2_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player4_id_fkey"
            columns: ["team2_player2_id"]
            isOneToOne: false
            referencedRelation: "users_sorted_by_mmr"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings_history: {
        Row: {
          change_amount: number | null
          change_type: string | null
          created_at: string | null
          id: number
          match_id: string | null
          new_mmr: number | null
          old_mmr: number | null
          partner_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          change_amount?: number | null
          change_type?: string | null
          created_at?: string | null
          id?: never
          match_id?: string | null
          new_mmr?: number | null
          old_mmr?: number | null
          partner_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          change_amount?: number | null
          change_type?: string | null
          created_at?: string | null
          id?: never
          match_id?: string | null
          new_mmr?: number | null
          old_mmr?: number | null
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
            foreignKeyName: "ratings_history_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "users_sorted_by_mmr"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_sorted_by_mmr"
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
          auth_user_id: string | null
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
          auth_user_id?: string | null
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
          auth_user_id?: string | null
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
      users_sorted_by_mmr: {
        Row: {
          created_at: string | null
          current_mmr: number | null
          date_of_birth: string | null
          display_name: string | null
          gender: string | null
          id: string | null
          languages: string[] | null
          location: string | null
          nationality: string | null
          preferred_language: string | null
          profile_photo: string | null
          whatsapp_number: string | null
        }
        Relationships: []
      }
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
      complete_match: {
        Args: {
          match_id: string
          new_team1_score: number
          new_team2_score: number
          team1_win_mmr_change_amount: number
          team2_win_mmr_change_amount: number
        }
        Returns: undefined
      }
      create_match: {
        Args: {
          team1_player1_id: string
          team1_player2_id: string
          team2_player1_id: string
          team2_player2_id: string
          match_date: string
        }
        Returns: undefined
      }
      edit_user_profile: {
        Args: {
          i_user_id: string
          i_display_name: string
          i_gender: string
          i_date_of_birth: string
          i_languages: string[]
          i_preferred_language: string
          i_profile_photo: string
          i_whatsapp_number: string
          i_nationality: string
          i_location: string
        }
        Returns: undefined
      }
      get_latest_completed_matches: {
        Args: Record<PropertyKey, never>
        Returns: {
          match_id: string
          team1_player1_id: string
          team1_player2_id: string
          team2_player1_id: string
          team2_player2_id: string
          team1_score: number
          team2_score: number
          created_at: string
          team1_player1_display_name: string
          team1_player1_profile_photo: string
          team1_player2_display_name: string
          team1_player2_profile_photo: string
          team2_player1_display_name: string
          team2_player1_profile_photo: string
          team2_player2_display_name: string
          team2_player2_profile_photo: string
        }[]
      }
      get_latest_matches: {
        Args: {
          p_user_id: string
          page_number: number
        }
        Returns: {
          match_id: string
          user_id: string
          old_mmr: number
          change_amount: number
          change_type: string
          created_at: string
          partner_id: string
          new_mmr: number
          status: string
        }[]
      }
      get_user_friends: {
        Args: {
          i_user_id: string
        }
        Returns: {
          friend_id: string
          status: string
          created_at: string
          display_name: string
          profile_photo: string
        }[]
      }
      get_user_profile: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          display_name: string
          created_at: string
          gender: string
          date_of_birth: string
          location: string
          languages: string[]
          preferred_language: string
          profile_photo: string
          whatsapp_number: string
          current_mmr: number
          nationality: string
        }[]
      }
      respond_friend_request:
        | {
            Args: {
              user_a_id_public: string
              friendship_id: number
              accept: boolean
            }
            Returns: undefined
          }
        | {
            Args: {
              user_a_id_public: string
              friendship_id: string
              accept: boolean
            }
            Returns: undefined
          }
      send_friend_request:
        | {
            Args: {
              i_email: string
            }
            Returns: string
          }
        | {
            Args: {
              i_email: string
              user_a_id_public: string
            }
            Returns: undefined
          }
      view_friend_requests: {
        Args: {
          user_a_id_public: string
        }
        Returns: {
          friend_id: string
          profile_photo: string
          display_name: string
          gender: string
          current_mmr: number
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
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
      friendship_status:
        | "INVITED"
        | "CONFIRMED"
        | "RECEIVED"
        | "DELETED"
        | "IGNORED"
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
