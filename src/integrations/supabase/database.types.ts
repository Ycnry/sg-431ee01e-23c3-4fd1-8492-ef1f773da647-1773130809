/* eslint-disable @typescript-eslint/no-empty-object-type */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      auth_sessions: {
        Row: {
          created_at: string | null
          device_info: string | null
          expires_at: string
          id: string
          ip_address: string | null
          is_valid: boolean | null
          last_used_at: string | null
          refresh_token_hash: string
          remember_me: boolean | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          is_valid?: boolean | null
          last_used_at?: string | null
          refresh_token_hash: string
          remember_me?: boolean | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          is_valid?: boolean | null
          last_used_at?: string | null
          refresh_token_hash?: string
          remember_me?: boolean | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auth_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "smart_fundi_users"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token_hash: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token_hash: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token_hash?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "smart_fundi_users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rate_limit_violations: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          identifier: string
          ip_address: string | null
          limit_exceeded: number
          user_agent: string | null
          user_id: string | null
          violation_count: number | null
          window_minutes: number
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          identifier: string
          ip_address?: string | null
          limit_exceeded: number
          user_agent?: string | null
          user_id?: string | null
          violation_count?: number | null
          window_minutes: number
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          identifier?: string
          ip_address?: string | null
          limit_exceeded?: number
          user_agent?: string | null
          user_id?: string | null
          violation_count?: number | null
          window_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "rate_limit_violations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "smart_fundi_users"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          identifier: string
          request_count: number | null
          updated_at: string | null
          window_duration_minutes: number
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          identifier: string
          request_count?: number | null
          updated_at?: string | null
          window_duration_minutes: number
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          identifier?: string
          request_count?: number | null
          updated_at?: string | null
          window_duration_minutes?: number
          window_start?: string | null
        }
        Relationships: []
      }
      smart_fundi_users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          email: string | null
          email_verified_at: string | null
          failed_login_attempts: number | null
          full_name: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_login_at: string | null
          last_login_ip: string | null
          locked_until: string | null
          national_id: string | null
          opening_hours: Json | null
          password_changed_at: string | null
          password_hash: string | null
          phone: string | null
          phone_verified_at: string | null
          role: Database["public"]["Enums"]["user_role"]
          shop_categories: string[] | null
          shop_name: string | null
          specialty: string[] | null
          subscription_ends_at: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trial_ends_at: string | null
          updated_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          ward: string | null
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          email_verified_at?: string | null
          failed_login_attempts?: number | null
          full_name: string
          id: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login_at?: string | null
          last_login_ip?: string | null
          locked_until?: string | null
          national_id?: string | null
          opening_hours?: Json | null
          password_changed_at?: string | null
          password_hash?: string | null
          phone?: string | null
          phone_verified_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          shop_categories?: string[] | null
          shop_name?: string | null
          specialty?: string[] | null
          subscription_ends_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          ward?: string | null
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          email_verified_at?: string | null
          failed_login_attempts?: number | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login_at?: string | null
          last_login_ip?: string | null
          locked_until?: string | null
          national_id?: string | null
          opening_hours?: Json | null
          password_changed_at?: string | null
          password_hash?: string | null
          phone?: string | null
          phone_verified_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          shop_categories?: string[] | null
          shop_name?: string | null
          specialty?: string[] | null
          subscription_ends_at?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          trial_ends_at?: string | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          ward?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      super_agents: {
        Row: {
          bio: string | null
          city: string
          created_at: string | null
          email: string | null
          full_name: string
          fundis_onboarded: number | null
          id: string
          id_document_url: string | null
          is_verified: boolean | null
          last_payment_amount: number | null
          last_payment_date: string | null
          national_id_number: string | null
          payment_method: string | null
          phone: string
          photo_url: string | null
          region: string
          shops_onboarded: number | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string
          total_commission: number | null
          updated_at: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          bio?: string | null
          city: string
          created_at?: string | null
          email?: string | null
          full_name: string
          fundis_onboarded?: number | null
          id?: string
          id_document_url?: string | null
          is_verified?: boolean | null
          last_payment_amount?: number | null
          last_payment_date?: string | null
          national_id_number?: string | null
          payment_method?: string | null
          phone: string
          photo_url?: string | null
          region: string
          shops_onboarded?: number | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string
          total_commission?: number | null
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          bio?: string | null
          city?: string
          created_at?: string | null
          email?: string | null
          full_name?: string
          fundis_onboarded?: number | null
          id?: string
          id_document_url?: string | null
          is_verified?: boolean | null
          last_payment_amount?: number | null
          last_payment_date?: string | null
          national_id_number?: string | null
          payment_method?: string | null
          phone?: string
          photo_url?: string | null
          region?: string
          shops_onboarded?: number | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string
          total_commission?: number | null
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      validation_logs: {
        Row: {
          created_at: string | null
          endpoint: string
          error_message: string
          id: string
          input_data: Json | null
          ip_address: string | null
          severity: string | null
          user_id: string | null
          validation_type: string
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          error_message: string
          id?: string
          input_data?: Json | null
          ip_address?: string | null
          severity?: string | null
          user_id?: string | null
          validation_type: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          error_message?: string
          id?: string
          input_data?: Json | null
          ip_address?: string | null
          severity?: string | null
          user_id?: string | null
          validation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "smart_fundi_users"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token_hash: string
          user_id: string
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token_hash: string
          user_id: string
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token_hash?: string
          user_id?: string
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "smart_fundi_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_endpoint: string
          p_identifier: string
          p_max_requests: number
          p_window_minutes: number
        }
        Returns: Json
      }
      cleanup_expired_sessions: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      log_rate_limit_violation: {
        Args: {
          p_endpoint: string
          p_identifier: string
          p_ip_address: string
          p_limit_exceeded: number
          p_user_agent: string
          p_user_id: string
          p_window_minutes: number
        }
        Returns: string
      }
      log_validation_failure: {
        Args: {
          p_endpoint: string
          p_error_type: string
          p_field_name: string
          p_ip_address: string
          p_request_data?: Json
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      subscription_status: "trial" | "active" | "expired" | "cancelled"
      user_role: "customer" | "fundi" | "shop" | "admin" | "super_agent"
      verification_status: "pending" | "verified" | "rejected"
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
      subscription_status: ["trial", "active", "expired", "cancelled"],
      user_role: ["customer", "fundi", "shop", "admin", "super_agent"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
