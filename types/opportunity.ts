import { Database } from './supabase';

export type Opportunity = Database['public']['Tables']['opportunities']['Row'] & {
    customers?: {
        name: string;
    } | null;
};

export type OpportunityStage = Database['public']['Enums']['project_commercial_stage'];

export const STAGE_LABELS: Record<OpportunityStage, string> = {
    Akquise: 'Akquise (Lead)',
    Angeboten: 'Angebot',
    Verhandlung: 'Verhandlung',
    Beauftragt: 'Beauftragt',
    'In Umsetzung': 'In Umsetzung',
    Verloren: 'Verloren',
    Abgebrochen: 'Abgebrochen'
};

export const STAGE_ORDER: OpportunityStage[] = [
    'Akquise',
    'Angeboten',
    'Verhandlung',
    'Beauftragt',
    'Verloren'
];
