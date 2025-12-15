export type CustomerStatus = 'Clean' | 'Approached' | 'Negotiation' | 'Deal' | 'Lost';
export type CustomerCategory = 'A' | 'B' | 'C' | 'D' | 'Lead' | 'Partner';
export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ContactType = 'Visit' | 'Call' | 'Email' | 'Note';

export interface Customer {
    id: string;
    name: string;
    address: string | null;
    contact_person: string | null;
    lat: number | null;
    lng: number | null;
    category: CustomerCategory | string | null;
    image_url: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    last_contact_date: string | null; // ISO Date string
    next_visit_due: string | null; // ISO Date string
    notes: string | null;
    is_new_lead: boolean | null;
    last_call_notes: string | null;
    urgency_level: UrgencyLevel | string | null;
    pending_actions: Record<string, any> | null;
    status: CustomerStatus | string | null;
    assigned_user_id: string | null;
    billing_address: string | null;
    billing_location_id: string | null;
    annual_revenue_target: number | null;
}

export interface ContactProtocol {
    id: string;
    customer_id: string;
    created_by: string | null;
    contact_type: ContactType | string;
    summary_html: string | null;
    created_at: string; // ISO Date string
    next_action: string | null;
    next_action_deadline: string | null; // ISO Date string
}
