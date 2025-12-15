import React from 'react';
import { createClient } from '@/utils/supabase/server';
import OpportunityBoard from '@/components/opportunities/OpportunityBoard';
import { Opportunity } from '@/types/opportunity';

export default async function OpportunitiesPage() {
    const supabase = createClient();
    const { data: opportunities, error } = await (await supabase)
        .from('opportunities')
        .select('*, customers(name)');

    if (error) {
        console.error('Error fetching opportunities:', error);
        return <div>Error loading opportunities</div>;
    }

    // Cast strictly to Opportunity[] to handle the join type
    const typedOpportunities = (opportunities || []) as unknown as Opportunity[];

    return (
        <div className="h-full flex flex-col p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
                    <p className="text-muted-foreground">Manage your sales pipeline and deals.</p>
                </div>
                <div>
                    {/* Add New Opportunity Button could go here */}
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <OpportunityBoard initialOpportunities={typedOpportunities} />
            </div>
        </div>
    );
}
