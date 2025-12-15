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
            contact_persons: {
                Row: {
                    created_at: string | null
                    customer_id: string
                    email: string | null
                    first_name: string
                    id: string
                    is_main_contact: boolean | null
                    last_name: string
                    phone: string | null
                    role: string | null
                }
                Insert: {
                    created_at?: string | null
                    customer_id: string
                    email?: string | null
                    first_name: string
                    id?: string
                    is_main_contact?: boolean | null
                    last_name: string
                    phone?: string | null
                    role?: string | null
                }
                Update: {
                    created_at?: string | null
                    customer_id?: string
                    email?: string | null
                    first_name?: string
                    id?: string
                    is_main_contact?: boolean | null
                    last_name?: string
                    phone?: string | null
                    role?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "contact_persons_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "customers"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contact_persons_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "revenue_by_customer_view"
                        referencedColumns: ["customer_id"]
                    },
                ]
            }
            contact_protocols: {
                Row: {
                    contact_type: Database["public"]["Enums"]["contact_type"]
                    created_at: string | null
                    created_by: string
                    customer_id: string
                    date: string
                    description: string | null
                    id: string
                    notes: string | null
                    summary: string
                }
                Insert: {
                    contact_type: Database["public"]["Enums"]["contact_type"]
                    created_at?: string | null
                    created_by?: string
                    customer_id: string
                    date?: string
                    description?: string | null
                    id?: string
                    notes?: string | null
                    summary: string
                }
                Update: {
                    contact_type?: Database["public"]["Enums"]["contact_type"]
                    created_at?: string | null
                    created_by?: string
                    customer_id?: string
                    date?: string
                    description?: string | null
                    id?: string
                    notes?: string | null
                    summary?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "contact_protocols_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contact_protocols_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "customers"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "contact_protocols_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "revenue_by_customer_view"
                        referencedColumns: ["customer_id"]
                    },
                ]
            }
            customers: {
                Row: {
                    address: string | null
                    address_status: string | null
                    assigned_user_id: string | null
                    category: string | null
                    contact_person: string | null
                    created_at: string | null
                    customer_type: string | null
                    email: string | null
                    id: string
                    last_contact_date: string | null
                    lat: number | null
                    lng: number | null
                    name: string
                    next_visit_date: string | null
                    phone: string | null
                    status: Database["public"]["Enums"]["customer_status"] | null
                    website: string | null
                }
                Insert: {
                    address?: string | null
                    address_status?: string | null
                    assigned_user_id?: string | null
                    category?: string | null
                    contact_person?: string | null
                    created_at?: string | null
                    customer_type?: string | null
                    email?: string | null
                    id?: string
                    last_contact_date?: string | null
                    lat?: number | null
                    lng?: number | null
                    name: string
                    next_visit_date?: string | null
                    phone?: string | null
                    status?: Database["public"]["Enums"]["customer_status"] | null
                    website?: string | null
                }
                Update: {
                    address?: string | null
                    address_status?: string | null
                    assigned_user_id?: string | null
                    category?: string | null
                    contact_person?: string | null
                    created_at?: string | null
                    customer_type?: string | null
                    email?: string | null
                    id?: string
                    last_contact_date?: string | null
                    lat?: number | null
                    lng?: number | null
                    name?: string
                    next_visit_date?: string | null
                    phone?: string | null
                    status?: Database["public"]["Enums"]["customer_status"] | null
                    website?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "customers_assigned_user_id_fkey"
                        columns: ["assigned_user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            expenses: {
                Row: {
                    amount: number
                    category: string
                    created_at: string | null
                    date: string
                    description: string | null
                    id: string
                    receipt_url: string | null
                    tour_id: string
                    user_id: string
                }
                Insert: {
                    amount: number
                    category: string
                    created_at?: string | null
                    date: string
                    description?: string | null
                    id?: string
                    receipt_url?: string | null
                    tour_id: string
                    user_id: string
                }
                Update: {
                    amount?: number
                    category?: string
                    created_at?: string | null
                    date?: string
                    description?: string | null
                    id?: string
                    receipt_url?: string | null
                    tour_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "expenses_tour_id_fkey"
                        columns: ["tour_id"]
                        isOneToOne: false
                        referencedRelation: "tours"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "expenses_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            opportunities: {
                Row: {
                    created_at: string | null
                    customer_id: string
                    description: string | null
                    expected_revenue: number
                    id: string
                    probability: number
                    stage: Database["public"]["Enums"]["project_commercial_stage"]
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    customer_id: string
                    description?: string | null
                    expected_revenue: number
                    id?: string
                    probability?: number
                    stage: Database["public"]["Enums"]["project_commercial_stage"]
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    customer_id?: string
                    description?: string | null
                    expected_revenue?: number
                    id?: string
                    probability?: number
                    stage?: Database["public"]["Enums"]["project_commercial_stage"]
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "opportunities_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "customers"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "opportunities_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "revenue_by_customer_view"
                        referencedColumns: ["customer_id"]
                    },
                ]
            }
            project_milestones: {
                Row: {
                    completed_at: string | null
                    created_at: string | null
                    due_date: string
                    id: string
                    is_completed: boolean | null
                    project_id: string
                    title: string
                }
                Insert: {
                    completed_at?: string | null
                    created_at?: string | null
                    due_date: string
                    id?: string
                    is_completed?: boolean | null
                    project_id: string
                    title: string
                }
                Update: {
                    completed_at?: string | null
                    created_at?: string | null
                    due_date?: string
                    id?: string
                    is_completed?: boolean | null
                    project_id?: string
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "project_milestones_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            project_tasks: {
                Row: {
                    assigned_user_id: string | null
                    created_at: string | null
                    description: string | null
                    due_date: string | null
                    id: string
                    parent_task_id: string | null
                    position: number
                    priority: string
                    project_id: string
                    status: string
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    assigned_user_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    parent_task_id?: string | null
                    position?: number
                    priority?: string
                    project_id: string
                    status?: string
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    assigned_user_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    due_date?: string | null
                    id?: string
                    parent_task_id?: string | null
                    position?: number
                    priority?: string
                    project_id?: string
                    status?: string
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "project_tasks_assigned_user_id_fkey"
                        columns: ["assigned_user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "project_tasks_parent_task_id_fkey"
                        columns: ["parent_task_id"]
                        isOneToOne: false
                        referencedRelation: "project_tasks"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "project_tasks_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            projects: {
                Row: {
                    assigned_user_id: string | null
                    budget: number | null
                    created_at: string | null
                    customer_id: string | null
                    description: string | null
                    end_date: string | null
                    id: string
                    name: string
                    priority: string | null
                    progress: number | null
                    project_leader: string | null
                    project_leader_id: string | null
                    start_date: string | null
                    status: string | null
                    updated_at: string | null
                }
                Insert: {
                    assigned_user_id?: string | null
                    budget?: number | null
                    created_at?: string | null
                    customer_id?: string | null
                    description?: string | null
                    end_date?: string | null
                    id?: string
                    name: string
                    priority?: string | null
                    progress?: number | null
                    project_leader?: string | null
                    project_leader_id?: string | null
                    start_date?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    assigned_user_id?: string | null
                    budget?: number | null
                    created_at?: string | null
                    customer_id?: string | null
                    description?: string | null
                    end_date?: string | null
                    id?: string
                    name?: string
                    priority?: string | null
                    progress?: number | null
                    project_leader?: string | null
                    project_leader_id?: string | null
                    start_date?: string | null
                    status?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_assigned_user_id_fkey"
                        columns: ["assigned_user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "projects_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "customers"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "projects_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "revenue_by_customer_view"
                        referencedColumns: ["customer_id"]
                    },
                    {
                        foreignKeyName: "projects_project_leader_id_fkey"
                        columns: ["project_leader_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            task_subitems: {
                Row: {
                    id: string
                    is_completed: boolean | null
                    position: number | null
                    task_id: string | null
                    title: string
                }
                Insert: {
                    id?: string
                    is_completed?: boolean | null
                    position?: number | null
                    task_id?: string | null
                    title: string
                }
                Update: {
                    id?: string
                    is_completed?: boolean | null
                    position?: number | null
                    task_id?: string | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "task_subitems_task_id_fkey"
                        columns: ["task_id"]
                        isOneToOne: false
                        referencedRelation: "project_tasks"
                        referencedColumns: ["id"]
                    },
                ]
            }
            time_entries: {
                Row: {
                    duration_minutes: number
                    id: string
                    logged_at: string | null
                    task_id: string | null
                    user_id: string | null
                }
                Insert: {
                    duration_minutes: number
                    id?: string
                    logged_at?: string | null
                    task_id?: string | null
                    user_id?: string | null
                }
                Update: {
                    duration_minutes?: number
                    id?: string
                    logged_at?: string | null
                    task_id?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "time_entries_task_id_fkey"
                        columns: ["task_id"]
                        isOneToOne: false
                        referencedRelation: "project_tasks"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "time_entries_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tour_days: {
                Row: {
                    created_at: string
                    date: string | null
                    day_number: number
                    end_drive_duration: number | null
                    id: string
                    is_overtime: boolean | null
                    start_drive_duration: number | null
                    total_distance: number | null
                    total_duration: number | null
                    total_meeting_time: number | null
                    total_work_time: number | null
                    tour_id: string
                }
                Insert: {
                    created_at?: string
                    date?: string | null
                    day_number: number
                    end_drive_duration?: number | null
                    id?: string
                    is_overtime?: boolean | null
                    start_drive_duration?: number | null
                    total_distance?: number | null
                    total_duration?: number | null
                    total_meeting_time?: number | null
                    total_work_time?: number | null
                    tour_id: string
                }
                Update: {
                    created_at?: string
                    date?: string | null
                    end_drive_duration?: number | null
                    id?: string
                    is_overtime?: boolean | null
                    start_drive_duration?: number | null
                    total_distance?: number | null
                    total_duration?: number | null
                    total_meeting_time?: number | null
                    total_work_time?: number | null
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
                    address: string | null
                    arrival_time: string | null
                    contact_person: string | null
                    created_at: string
                    customer_id: string | null
                    description: string | null
                    distance_to_next: number | null
                    duration_minutes: number | null
                    duration_to_next: number | null
                    id: string
                    lat: number | null
                    lng: number | null
                    meeting_duration: number | null
                    name: string | null
                    notes: string | null
                    place_id: string | null
                    price: number | null
                    scheduled_time: string | null
                    sequence_order: number
                    sort_order: number | null
                    tour_day_id: string
                    type: string
                    visited: boolean | null
                }
                Insert: {
                    address?: string | null
                    arrival_time?: string | null
                    contact_person?: string | null
                    created_at?: string
                    customer_id?: string | null
                    description?: string | null
                    distance_to_next?: number | null
                    duration_minutes?: number | null
                    duration_to_next?: number | null
                    id?: string
                    lat?: number | null
                    lng?: number | null
                    meeting_duration?: number | null
                    name?: string | null
                    notes?: string | null
                    place_id?: string | null
                    price?: number | null
                    scheduled_time?: string | null
                    sequence_order: number
                    sort_order?: number | null
                    tour_day_id: string
                    type: string
                    visited?: boolean | null
                }
                Update: {
                    address?: string | null
                    arrival_time?: string | null
                    contact_person?: string | null
                    created_at?: string
                    customer_id?: string | null
                    description?: string | null
                    distance_to_next?: number | null
                    duration_minutes?: number | null
                    duration_to_next?: number | null
                    id?: string
                    lat?: number | null
                    lng?: number | null
                    meeting_duration?: number | null
                    name?: string | null
                    notes?: string | null
                    place_id?: string | null
                    price?: number | null
                    scheduled_time?: string | null
                    sequence_order?: number
                    sort_order?: number | null
                    tour_day_id?: string
                    type?: string
                    visited?: boolean | null
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
                        foreignKeyName: "tour_stops_customer_id_fkey"
                        columns: ["customer_id"]
                        isOneToOne: false
                        referencedRelation: "revenue_by_customer_view"
                        referencedColumns: ["customer_id"]
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
                    end_point: Json | null
                    id: string
                    name: string
                    start_point: Json | null
                    status: string
                    total_distance: number | null
                    total_duration: number | null
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    end_point?: Json | null
                    id?: string
                    name: string
                    start_point?: Json | null
                    status: string
                    total_distance?: number | null
                    total_duration?: number | null
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    end_point?: Json | null
                    id?: string
                    name?: string
                    start_point?: Json | null
                    status?: string
                    total_distance?: number | null
                    total_duration?: number | null
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tours_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                ]
            }
            users: {
                Row: {
                    email: string | null
                    id: string
                    name: string | null
                    password: string | null
                    role: Database["public"]["Enums"]["user_role"] | null
                    surname: string | null
                    username: string | null
                }
                Insert: {
                    email?: string | null
                    id?: string
                    name?: string | null
                    password?: string | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                    surname?: string | null
                    username?: string | null
                }
                Update: {
                    email?: string | null
                    id?: string
                    name?: string | null
                    password?: string | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                    surname?: string | null
                    username?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            funnel_summary_view: {
                Row: {
                    stage: Database["public"]["Enums"]["project_commercial_stage"] | null
                    total_expected_revenue: number | null
                    total_revenue: number | null
                }
                Relationships: []
            }
            project_pipeline_view: {
                Row: {
                    customer_name: string | null
                    expected_revenue: number | null
                    name: string | null
                    probability: number | null
                    stage: Database["public"]["Enums"]["project_commercial_stage"] | null
                    status: string | null
                }
                Relationships: []
            }
            project_task_export: {
                Row: {
                    assigned_user: string | null
                    description: string | null
                    due_date: string | null
                    id: string | null
                    priority: string | null
                    project_name: string | null
                    status: string | null
                    task_title: string | null
                }
                Relationships: []
            }
            revenue_by_customer_view: {
                Row: {
                    customer_id: string | null
                    customer_name: string | null
                    deal_count: number | null
                    total_expected_revenue: number | null
                    total_revenue: number | null
                }
                Relationships: []
            }
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            contact_type: "TELEFON" | "EMAIL" | "VOR_ORT" | "VIDEO_CALL" | "SONSTIGES"
            customer_status:
            | "KALTAKQUISE"
            | "AKQUISE"
            | "LEAD"
            | "PROJEKTKUNDE"
            | "MESSEKONTAKT"
            project_commercial_stage:
            | "Akquise"
            | "Angeboten"
            | "Verhandlung"
            | "Beauftragt"
            | "In Umsetzung"
            | "Verloren"
            | "Abgebrochen"
            user_role: "user" | "manager" | "ceo"
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
    TableName extends PublicTableNameOrOptions extends { schema: "public" }
    ? keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: "public" }
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[TableName] extends {
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
    TableName extends PublicTableNameOrOptions extends { schema: "public" }
    ? keyof Database["public"]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: "public" }
    ? Database["public"]["Tables"][TableName] extends {
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
    TableName extends PublicTableNameOrOptions extends { schema: "public" }
    ? keyof Database["public"]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: "public" }
    ? Database["public"]["Tables"][TableName] extends {
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
    EnumName extends PublicEnumNameOrOptions extends { schema: "public" }
    ? keyof Database["public"]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: "public" }
    ? Database["public"]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: "public"
    }
    ? keyof Database["public"]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: "public" }
    ? Database["public"]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {
            contact_type: ["TELEFON", "EMAIL", "VOR_ORT", "VIDEO_CALL", "SONSTIGES"],
            customer_status: [
                "KALTAKQUISE",
                "AKQUISE",
                "LEAD",
                "PROJEKTKUNDE",
                "MESSEKONTAKT",
            ],
            project_commercial_stage: [
                "Akquise",
                "Angeboten",
                "Verhandlung",
                "Beauftragt",
                "In Umsetzung",
                "Verloren",
                "Abgebrochen",
            ],
            user_role: ["user", "manager", "ceo"],
        },
    },
} as const
