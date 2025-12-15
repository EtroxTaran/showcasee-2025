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
        PostgrestVersion: "13.0.5"
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
                        referencedRelation: "customers"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    created_at: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    role: Database["public"]["Enums"]["user_role"] | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    role?: Database["public"]["Enums"]["user_role"] | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    role?: Database["public"]["Enums"]["user_role"] | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
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
            customer_category: "A" | "B" | "C" | "PROSPECT"
            user_role: "GF" | "PLAN" | "ADM" | "KALK" | "BUCH"
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
    | { schema: Exclude<keyof Database, '__InternalSupabase'> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
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
    | { schema: Exclude<keyof Database, '__InternalSupabase'> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
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
    | { schema: Exclude<keyof Database, '__InternalSupabase'> },
    TableName extends PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
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
    | { schema: Exclude<keyof Database, '__InternalSupabase'> },
    EnumName extends PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: Exclude<keyof Database, '__InternalSupabase'> },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: Exclude<keyof Database, '__InternalSupabase'>
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: Exclude<keyof Database, '__InternalSupabase'> }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
