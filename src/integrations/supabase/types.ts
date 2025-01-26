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
      feature_updates: {
        Row: {
          change_items: string[]
          created_at: string | null
          id: number
          is_deployed: boolean
          islikedby: string[] | null
          release_date: string
          title: string
          version_number: string | null
        }
        Insert: {
          change_items: string[]
          created_at?: string | null
          id?: never
          is_deployed?: boolean
          islikedby?: string[] | null
          release_date: string
          title: string
          version_number?: string | null
        }
        Update: {
          change_items?: string[]
          created_at?: string | null
          id?: never
          is_deployed?: boolean
          islikedby?: string[] | null
          release_date?: string
          title?: string
          version_number?: string | null
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
        Relationships: []
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
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_user_email: string | null
          referred_user_id: string | null
          referrer_id: string
          signup_completed_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_user_email?: string | null
          referred_user_id?: string | null
          referrer_id: string
          signup_completed_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_user_email?: string | null
          referred_user_id?: string | null
          referrer_id?: string
          signup_completed_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users_sorted_by_mmr"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          current_mmr: number | null
          date_of_birth: string | null
          display_name: string
          email: string | null
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
          email?: string | null
          gender?: string | null
          id: string
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
          email?: string | null
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
        Returns: string
      }
      edit_user_profile: {
        Args: {
          user_a_id: string
          new_display_name: string
          new_gender: string
          new_date_of_birth: string
          new_languages: string[]
          new_preferred_language: string
          new_profile_photo: string
          new_whatsapp_number: string
          new_nationality: string
          new_location: string
        }
        Returns: undefined
      }
      get_feature_updates: {
        Args: Record<PropertyKey, never>
        Returns: {
          version_number: string
          is_deployed: boolean
          release_date: string
          islikedby: string[]
          change_items: string[]
          title: string
        }[]
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
      get_my_completed_matches: {
        Args: {
          user_a_id: string
        }
        Returns: {
          change_amount: number
          old_mmr: number
          change_type: string
          new_mmr: number
          match_id: string
          team1_score: number
          team2_score: number
          created_at: string
          player1_id: string
          player1_display_name: string
          player1_profile_photo: string
          player2_id: string
          player2_display_name: string
          player2_profile_photo: string
          player3_id: string
          player3_display_name: string
          player3_profile_photo: string
          player4_id: string
          player4_display_name: string
          player4_profile_photo: string
        }[]
      }
      get_user_friends: {
        Args: {
          i_user_id: string
        }
        Returns: {
          friend_id: string
          status: Database["public"]["Enums"]["friendship_status"]
          created_at: string
          display_name: string
          profile_photo: string
        }[]
      }
      get_user_profile: {
        Args: {
          user_a_id: string
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
          email: string
        }[]
      }
      insert_feature_update: {
        Args: {
          p_version_number: string
          p_is_deployed: boolean
          p_release_date: string
          p_islikedby: string[]
          p_change_items: string[]
          p_title: string
        }
        Returns: undefined
      }
      insert_referral_temp: {
        Args: {
          p_referrer_id: string
          p_referred_user_email: string
        }
        Returns: undefined
      }
      respond_friend_request:
        | {
            Args: {
              user_a_id: string
              friendship_id: number
              accept: boolean
            }
            Returns: undefined
          }
        | {
            Args: {
              user_a_id: string
              user_b_id: string
              accept: boolean
            }
            Returns: undefined
          }
      send_friend_request: {
        Args: {
          i_email: string
          user_a_id_public: string
        }
        Returns: undefined
      }
      send_friend_request_leaderboard: {
        Args: {
          user_a_id_public: string
          user_b_id_public: string
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
      referral_status: "PENDING" | "USED"
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
