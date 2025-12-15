import { Database } from './supabase';

export type Opportunity = Database['public']['Tables']['opportunities']['Row'] & {
    customers?: {
        name: string;
    } | null;
};

export type OpportunityStage = Database['public']['Enums']['opportunity_stage'];

export const STAGE_LABELS: Record<OpportunityStage, string> = {
    lead: 'Lead',
    offered: 'Offered',
    negotiation: 'Negotiation',
    signed: 'Signed',
    lost: 'Lost',
};

export const STAGE_ORDER: OpportunityStage[] = [
    'lead',
    'offered',
    'negotiation',
    'signed',
    'lost'
];
