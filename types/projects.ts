export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled';

export interface Project {
    id: string;
    created_at: string | null;
    updated_at: string | null;
    name: string;
    description: string | null;
    budget: number | null;
    status: ProjectStatus; // In DB it might be nullable or text, but we enforce enum in app usually. DB type says string | null usually if not not-null
    start_date: string | null;
    end_date: string | null;
    customer_id: string | null;
    opportunity_id: string | null;
    owner_id: string | null;
    milestones: any | null;
    customers?: {
        name: string | null;
    } | null;
}
