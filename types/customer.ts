export type CustomerStatus = 'Clean' | 'Approached' | 'Negotiation' | 'Deal' | 'Lost';
export type CustomerCategory = 'A' | 'B' | 'C' | 'D' | 'Lead' | 'Partner';
export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ContactType = 'visit' | 'call' | 'email' | 'note';

export interface Customer {
    id: string;
    created_at?: string | null;
    name: string;
    address: string | null;
    contact_person?: string | null;
    lat: number | null;
    lng: number | null;
    category: CustomerCategory | string | null;
    image_url?: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    last_contact_date?: string | null; // ISO Date string
    next_visit_due?: string | null; // ISO Date string
    notes?: string | null;
    is_new_lead?: boolean | null;
    last_call_notes?: string | null;
    urgency_level?: UrgencyLevel | string | null;
    pending_actions?: Record<string, unknown> | null;
    status: CustomerStatus | string | null;
    assigned_user_id?: string | null;
    // Database has assignee_id, handling mismatch
    assignee_id?: string | null;
    billing_address?: string | null;
    billing_location_id?: string | null;
    annual_revenue_target?: number | null;
}

export interface Interaction {
    id: string;
    customer_id: string;
    type: ContactType | string;
    notes: string | null;
    date: string; // ISO Date string for when the interaction happened
    created_at: string;
}
