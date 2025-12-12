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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      app_users: {
        Row: {
          display_name: string | null
          id: string
          password: string
          role: string
          username: string
        }
        Insert: {
          display_name?: string | null
          id?: string
          password: string
          role: string
          username: string
        }
        Update: {
          display_name?: string | null
          id?: string
          password?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          assigned_to: string
          created_at: string
          created_by_department: string
          created_by_name: string
          created_by_surname: string
          description: string
          id: string
          ip_address: string | null
          priority: string
          rejection_comment: string | null
          resolved_at: string | null
          status: string
          title: string
        }
        Insert: {
          assigned_to: string
          created_at: string
          created_by_department: string
          created_by_name: string
          created_by_surname: string
          description: string
          id: string
          ip_address?: string | null
          priority: string
          rejection_comment?: string | null
          resolved_at?: string | null
          status: string
          title: string
        }
        Update: {
          assigned_to?: string
          created_at?: string
          created_by_department?: string
          created_by_name?: string
          created_by_surname?: string
          description?: string
          id?: string
          ip_address?: string | null
          priority?: string
          rejection_comment?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      average_resolution_time: {
        Row: {
          avg_resolution_time: unknown
        }
        Relationships: []
      }
      ticket_distribution_by_department: {
        Row: {
          created_by_department: string | null
          ticket_count: number | null
        }
        Relationships: []
      }
      ticket_hourly_distribution: {
        Row: {
          hour_of_day: number | null
          ticket_count: number | null
        }
        Relationships: []
      }
      ticket_priority_distribution: {
        Row: {
          priority: string | null
          ticket_count: number | null
        }
        Relationships: []
      }
      ticket_status_summary: {
        Row: {
          status: string | null
          ticket_count: number | null
        }
        Relationships: []
      }
      ticket_summary_report: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          id: string | null
          resolved_at: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: []
      }
      tickets_last_7_days: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          id: string | null
          resolved_at: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          id?: string | null
          resolved_at?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: []
      }
      tickets_per_user: {
        Row: {
          assigned_to: string | null
          ticket_count: number | null
        }
        Relationships: []
      }
      tickets_per_user_status: {
        Row: {
          assigned_to: string | null
          status: string | null
          ticket_count: number | null
        }
        Relationships: []
      }
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
    Enums: {},
  },
} as const
