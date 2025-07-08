export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      booking_players: {
        Row: {
          booking_id: string
          payment_amount: number | null
          payment_currency: string | null
          payment_date: string | null
          payment_status: string | null
          player_id: string
        }
        Insert: {
          booking_id: string
          payment_amount?: number | null
          payment_currency?: string | null
          payment_date?: string | null
          payment_status?: string | null
          player_id: string
        }
        Update: {
          booking_id?: string
          payment_amount?: number | null
          payment_currency?: string | null
          payment_date?: string | null
          payment_status?: string | null
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_players_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "booking_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_id: string
          court_id: number | null
          created_at: string | null
          created_by: string | null
          end_time: string | null
          notes: string | null
          start_time: string
          status: string | null
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          booking_id?: string
          court_id?: number | null
          created_at?: string | null
          created_by?: string | null
          end_time?: string | null
          notes?: string | null
          start_time: string
          status?: string | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          booking_id?: string
          court_id?: number | null
          created_at?: string | null
          created_by?: string | null
          end_time?: string | null
          notes?: string | null
          start_time?: string
          status?: string | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["venue_id"]
          },
        ]
      }
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
      courts: {
        Row: {
          additional_info: string | null
          court_name: string
          court_number: number
          created_at: string | null
          id: number
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          additional_info?: string | null
          court_name: string
          court_number: number
          created_at?: string | null
          id?: never
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          additional_info?: string | null
          court_name?: string
          court_number?: number
          created_at?: string | null
          id?: never
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_venue"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["venue_id"]
          },
        ]
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
      level_requirements: {
        Row: {
          level: number
          max_xp: number
          min_xp: number
        }
        Insert: {
          level: number
          max_xp: number
          min_xp: number
        }
        Update: {
          level?: number
          max_xp?: number
          min_xp?: number
        }
        Relationships: []
      }
      match_players: {
        Row: {
          match_id: string
          player_id: string
          position: string
          team_number: number
        }
        Insert: {
          match_id: string
          player_id: string
          position: string
          team_number: number
        }
        Update: {
          match_id?: string
          player_id?: string
          position?: string
          team_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["match_id"]
          },
          {
            foreignKeyName: "match_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      match_sets: {
        Row: {
          created_at: string | null
          match_id: string | null
          set_id: string
          set_number: number
          team1_score: number
          team2_score: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          match_id?: string | null
          set_id?: string
          set_number: number
          team1_score: number
          team2_score: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          match_id?: string | null
          set_id?: string
          set_number?: number
          team1_score?: number
          team2_score?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_sets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["match_id"]
          },
        ]
      }
      matches: {
        Row: {
          booking_id: string | null
          completed_by: string | null
          created_at: string | null
          created_by: string | null
          match_date: string | null
          match_id: string
          match_number: number | null
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          match_date?: string | null
          match_id?: string
          match_number?: number | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          match_date?: string | null
          match_id?: string
          match_number?: number | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_v2_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["booking_id"]
          },
          {
            foreignKeyName: "matches_v2_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_v2_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      push_notifications: {
        Row: {
          content_template_id: string | null
          content_variables: Json | null
          created_at: string | null
          event_type: string | null
          id: number
          sent_at: string | null
          updated_at: string | null
          user_id: number | null
        }
        Insert: {
          content_template_id?: string | null
          content_variables?: Json | null
          created_at?: string | null
          event_type?: string | null
          id?: never
          sent_at?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Update: {
          content_template_id?: string | null
          content_variables?: Json | null
          created_at?: string | null
          event_type?: string | null
          id?: never
          sent_at?: string | null
          updated_at?: string | null
          user_id?: number | null
        }
        Relationships: []
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
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_user_id: string | null
          referred_user_whatsapp: string | null
          referrer_id: string
          signup_completed_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_user_id?: string | null
          referred_user_whatsapp?: string | null
          referrer_id: string
          signup_completed_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_user_id?: string | null
          referred_user_whatsapp?: string | null
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
        ]
      }
      tournament_applications: {
        Row: {
          created_at: string | null
          id: number
          player1_id: string
          player2_id: string | null
          status: Database["public"]["Enums"]["tournament_application_status"]
          team_name: string | null
          tournament_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          player1_id: string
          player2_id?: string | null
          status: Database["public"]["Enums"]["tournament_application_status"]
          team_name?: string | null
          tournament_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          player1_id?: string
          player2_id?: string | null
          status?: Database["public"]["Enums"]["tournament_application_status"]
          team_name?: string | null
          tournament_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_player"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tournament"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["tournament_id"]
          },
        ]
      }
      tournaments: {
        Row: {
          admins: string[]
          approval_type:
            | Database["public"]["Enums"]["tournament_approval_type"]
            | null
          bracket_type:
            | Database["public"]["Enums"]["tournament_bracket_type"]
            | null
          description: string | null
          end_date: string | null
          main_photo: string | null
          max_players: number | null
          name: string
          photo_gallery: Json | null
          privacy: Database["public"]["Enums"]["tournament_privacy"] | null
          recommended_mmr: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["tournament_status"] | null
          tournament_id: string
          venue_id: string | null
        }
        Insert: {
          admins: string[]
          approval_type?:
            | Database["public"]["Enums"]["tournament_approval_type"]
            | null
          bracket_type?:
            | Database["public"]["Enums"]["tournament_bracket_type"]
            | null
          description?: string | null
          end_date?: string | null
          main_photo?: string | null
          max_players?: number | null
          name: string
          photo_gallery?: Json | null
          privacy?: Database["public"]["Enums"]["tournament_privacy"] | null
          recommended_mmr?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["tournament_status"] | null
          tournament_id?: string
          venue_id?: string | null
        }
        Update: {
          admins?: string[]
          approval_type?:
            | Database["public"]["Enums"]["tournament_approval_type"]
            | null
          bracket_type?:
            | Database["public"]["Enums"]["tournament_bracket_type"]
            | null
          description?: string | null
          end_date?: string | null
          main_photo?: string | null
          max_players?: number | null
          name?: string
          photo_gallery?: Json | null
          privacy?: Database["public"]["Enums"]["tournament_privacy"] | null
          recommended_mmr?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["tournament_status"] | null
          tournament_id?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_venue"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["venue_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          current_mmr: number | null
          first_name: string | null
          gender: string | null
          id: string
          is_onboarded: boolean | null
          last_name: string | null
          location: string | null
          nationality: string | null
          profile_photo: string | null
        }
        Insert: {
          created_at?: string | null
          current_mmr?: number | null
          first_name?: string | null
          gender?: string | null
          id: string
          is_onboarded?: boolean | null
          last_name?: string | null
          location?: string | null
          nationality?: string | null
          profile_photo?: string | null
        }
        Update: {
          created_at?: string | null
          current_mmr?: number | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_onboarded?: boolean | null
          last_name?: string | null
          location?: string | null
          nationality?: string | null
          profile_photo?: string | null
        }
        Relationships: []
      }
      venues: {
        Row: {
          admins: string[] | null
          courts: Json | null
          email_address: string | null
          location: unknown | null
          name: string
          opening_hours: Json | null
          phone_number: string | null
          photo_gallery: Json | null
          venue_id: string
          website_url: string | null
        }
        Insert: {
          admins?: string[] | null
          courts?: Json | null
          email_address?: string | null
          location?: unknown | null
          name: string
          opening_hours?: Json | null
          phone_number?: string | null
          photo_gallery?: Json | null
          venue_id?: string
          website_url?: string | null
        }
        Update: {
          admins?: string[] | null
          courts?: Json | null
          email_address?: string | null
          location?: unknown | null
          name?: string
          opening_hours?: Json | null
          phone_number?: string | null
          photo_gallery?: Json | null
          venue_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_to_tournament: {
        Args: {
          p_tournament_id: string
          p_player1_id: string
          p_response_status?: Database["public"]["Enums"]["tournament_application_status"]
        }
        Returns: Json
      }
      calculate_mmr_change: {
        Args: { match_id: string }
        Returns: {
          team1_avg_mmr: number
          team2_avg_mmr: number
          team1_expected_win_rate: number
          team2_expected_win_rate: number
          team1_win_mmr_change_amount: number
          team2_win_mmr_change_amount: number
        }[]
      }
      check_onboarding: {
        Args: { user_a_id: string }
        Returns: Json
      }
      complete_match: {
        Args: {
          i_match_id: string
          new_team1_score: number
          new_team2_score: number
          team1_win_mmr_change_amount: number
          team2_win_mmr_change_amount: number
          user_a_id: string
        }
        Returns: undefined
      }
      complete_onboarding: {
        Args: {
          p_user_a_id: string
          p_first_name: string
          p_last_name: string
          p_gender: string
          p_nationality: string
          p_profile_photo: string
        }
        Returns: Json
      }
      create_booking_open: {
        Args: {
          p_user_a_id: string
          p_user_ids: Json
          p_venue_id: string
          p_start_time: string
          p_fee: number
          p_title: string
          p_description?: string
        }
        Returns: Json
      }
      create_match: {
        Args: {
          user_a_id: string
          team1_player1_id: string
          team1_player2_id?: string
          team2_player1_id?: string
          team2_player2_id?: string
        }
        Returns: string
      }
      create_tournament: {
        Args: {
          p_start_date: string
          p_end_date: string
          p_bracket_type: Database["public"]["Enums"]["tournament_bracket_type"]
          p_venue_id: string
          p_max_players: number
          p_user_a_id: string
          p_name: string
          p_description: string
        }
        Returns: Json
      }
      delete_tournament: {
        Args: { p_tournament_id: string; p_user_a_id: string }
        Returns: Json
      }
      edit_tournament: {
        Args: { p_tournament_id: string; p_user_a_id: string; updates: Json }
        Returns: Json
      }
      edit_user_profile: {
        Args:
          | {
              user_a_id: string
              new_display_name: string
              new_gender: string
              new_date_of_birth: string
              new_languages: string[]
              new_preferred_language: string
              new_profile_photo: string
              new_nationality: string
              new_location: string
            }
          | {
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
      friend_requests_counter: {
        Args: { user_a_id: string }
        Returns: Json
      }
      get_all_venues: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
      get_my_completed_matches: {
        Args: { user_a_id: string; page_number?: number; page_size?: number }
        Returns: Json
      }
      get_my_friends: {
        Args: { p_user_a_id: string }
        Returns: Json
      }
      get_venues: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      ignore_suggested_friend: {
        Args: { user_a_id_public: string; friend_id: string }
        Returns: Json
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
      notify_interest_tournament: {
        Args: {
          p_tournament_id: string
          p_player1_id: string
          p_response_status: Database["public"]["Enums"]["tournament_application_status"]
        }
        Returns: Json
      }
      publish_tournament: {
        Args: { p_tournament_id: string; p_user_a_id: string }
        Returns: Json
      }
      respond_friend_request: {
        Args: { user_a_id: string; friendship_id: number; accept: boolean }
        Returns: undefined
      }
      respond_tournament: {
        Args: {
          p_tournament_id: string
          p_player1_id: string
          p_player2_id?: string
        }
        Returns: Json
      }
      suggest_friends_top_mutual: {
        Args: { user_a_id_public: string }
        Returns: Json
      }
      suggest_users_played_with: {
        Args: { user_a_id_public: string }
        Returns: Json
      }
      view_friend_requests: {
        Args: { user_a_id_public: string }
        Returns: Json
      }
      view_profile: {
        Args: { user_a_id: string; user_b_id: string }
        Returns: Json
      }
      view_tournament: {
        Args: { p_tournament_id: string; p_user_a_id?: string }
        Returns: Json
      }
      view_tournaments: {
        Args: {
          p_status?: Database["public"]["Enums"]["tournament_status"]
          p_user_a_id?: string
        }
        Returns: Json
      }
    }
    Enums: {
      action_types:
        | "EDIT_PROFILE"
        | "SEND_FRIEND_REQUEST"
        | "REGISTER_MATCH"
        | "MATCH_PLAYED"
        | "SIGN_UP_COMPLETE"
        | "COMPLETE_PROFILE"
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
      tournament_application_status:
        | "INTERESTED"
        | "APPLIED"
        | "APPROVED"
        | "CONFIRMED_UNPAID"
        | "CONFIRMED_PAID"
        | "NOT_INTERESTED"
        | "DELETED"
        | "WAITLISTED"
      tournament_approval_type: "AUTOMATIC" | "MANUAL"
      tournament_bracket_type:
        | "SINGLE_ELIM"
        | "DOUBLE_ELIM"
        | "ROUND_ROBIN"
        | "AMERICANO_SOLO"
        | "MEXICANO_SOLO"
        | "AMERICANO_TEAM"
        | "MEXICANO_TEAM"
        | "MIXICANO"
      tournament_privacy: "INVITE_ONLY" | "FRIENDS" | "PUBLIC"
      tournament_status:
        | "INCOMPLETE"
        | "PENDING"
        | "COMPLETED"
        | "STARTED"
        | "DELETED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_types: [
        "EDIT_PROFILE",
        "SEND_FRIEND_REQUEST",
        "REGISTER_MATCH",
        "MATCH_PLAYED",
        "SIGN_UP_COMPLETE",
        "COMPLETE_PROFILE",
      ],
      change_type: ["WIN", "LOSS", "DRAW", "MANUAL"],
      continents: [
        "Africa",
        "Antarctica",
        "Asia",
        "Europe",
        "Oceania",
        "North America",
        "South America",
      ],
      friendship_status: [
        "INVITED",
        "CONFIRMED",
        "RECEIVED",
        "DELETED",
        "IGNORED",
      ],
      gender: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
      match_status: ["PENDING", "COMPLETED", "CANCELLED", "DELETED"],
      referral_status: ["PENDING", "USED"],
      tournament_application_status: [
        "INTERESTED",
        "APPLIED",
        "APPROVED",
        "CONFIRMED_UNPAID",
        "CONFIRMED_PAID",
        "NOT_INTERESTED",
        "DELETED",
        "WAITLISTED",
      ],
      tournament_approval_type: ["AUTOMATIC", "MANUAL"],
      tournament_bracket_type: [
        "SINGLE_ELIM",
        "DOUBLE_ELIM",
        "ROUND_ROBIN",
        "AMERICANO_SOLO",
        "MEXICANO_SOLO",
        "AMERICANO_TEAM",
        "MEXICANO_TEAM",
        "MIXICANO",
      ],
      tournament_privacy: ["INVITE_ONLY", "FRIENDS", "PUBLIC"],
      tournament_status: [
        "INCOMPLETE",
        "PENDING",
        "COMPLETED",
        "STARTED",
        "DELETED",
      ],
    },
  },
} as const
