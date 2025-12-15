export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          assignee_id: string | null
          category: Database["public"]["Enums"]["customer_category"] | null
          created_at: string | null
          email: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          next_visit: string | null
          phone: string | null
          status: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          assignee_id?: string | null
          category?: Database["public"]["Enums"]["customer_category"] | null
          created_at?: string | null
          email?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          next_visit?: string | null
          phone?: string | null
          status?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          assignee_id?: string | null
          category?: Database["public"]["Enums"]["customer_category"] | null
          created_at?: string | null
          email?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          next_visit?: string | null
          phone?: string | null
          status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      interactions: {
        Row: {
          created_at: string | null
          customer_id: string | null
          date: string | null
          id: string
          notes: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          date?: string | null
          id?: string
          notes?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          date?: string | null
          id?: string
          notes?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          created_at: string | null
          customer_id: string | null
          description: string | null
          expected_close_date: string | null
          id: string
          probability: number | null
          stage: Database["public"]["Enums"]["opportunity_stage"] | null
          title: string
          updated_at: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          probability?: number | null
          stage?: Database["public"]["Enums"]["opportunity_stage"] | null
          title: string
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          probability?: number | null
          stage?: Database["public"]["Enums"]["opportunity_stage"] | null
          title?: string
          updated_at?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          end_date: string | null
          id: string
          milestones: Json | null
          name: string
          opportunity_id: string | null
          owner_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          milestones?: Json | null
          name: string
          opportunity_id?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          milestones?: Json | null
          name?: string
          opportunity_id?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_days: {
        Row: {
          created_at: string
          date: string | null
          day_number: number
          id: string
          total_distance_meters: number | null
          total_duration_seconds: number | null
          tour_id: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          day_number: number
          id?: string
          total_distance_meters?: number | null
          total_duration_seconds?: number | null
          tour_id: string
        }
        Update: {
          created_at?: string
          date?: string | null
          day_number?: number
          id?: string
          total_distance_meters?: number | null
          total_duration_seconds?: number | null
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_days_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_stops: {
        Row: {
          arrival_time: string | null
          created_at: string
          customer_id: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          place_id: string | null
          sequence_order: number
          tour_day_id: string
          type: string
        }
        Insert: {
          arrival_time?: string | null
          created_at?: string
          customer_id?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          place_id?: string | null
          sequence_order: number
          tour_day_id: string
          type: string
        }
        Update: {
          arrival_time?: string | null
          created_at?: string
          customer_id?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          place_id?: string | null
          sequence_order?: number
          tour_day_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_stops_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_stops_tour_day_id_fkey"
            columns: ["tour_day_id"]
            isOneToOne: false
            referencedRelation: "tour_days"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_gf_stats: { Args: never; Returns: Json }
      get_sales_stats: { Args: never; Returns: Json }
    }
    Enums: {
      customer_category: "A" | "B" | "C" | "PROSPECT"
      opportunity_stage: "lead" | "offered" | "negotiation" | "signed" | "lost"
      project_status: "planning" | "in_progress" | "completed" | "cancelled"
      user_role: "ADM" | "GF" | "PLAN" | "KALK" | "BUCH"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      customer_category: ["A", "B", "C", "PROSPECT"],
      opportunity_stage: ["lead", "offered", "negotiation", "signed", "lost"],
      project_status: ["planning", "in_progress", "completed", "cancelled"],
      user_role: ["ADM", "GF", "PLAN", "KALK", "BUCH"],
    },
  },
} as const

