'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { Opportunity, OpportunityStage, STAGE_LABELS, STAGE_ORDER } from '@/types/opportunity';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { formatCurrency } from '@/lib/utils'; // I'll need to create this or check if it exists
import { Badge } from '@/components/ui/badge'; // Need to check if Badge exists

// --- Card Component ---
const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: opportunity.id,
        data: { opportunity },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="mb-3 cursor-grab active:cursor-grabbing">
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">{opportunity.title}</CardTitle>
                    <CardDescription className="text-xs">{opportunity.customers?.name || 'Unknown Customer'}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-b-xl">
                    <span className="text-sm font-semibold">{formatCurrency(opportunity.expected_revenue)}</span>
                    <Badge variant="outline" className="text-[10px] h-5">{opportunity.probability}%</Badge>
                </CardContent>
            </Card>
        </div>
    );
};

// --- Column Component ---
const KanbanColumn = ({ stage, opportunities }: { stage: OpportunityStage, opportunities: Opportunity[] }) => {
    const { setNodeRef } = useDroppable({
        id: stage,
    });

    const totalValue = opportunities.reduce((sum, opp) => sum + (opp.expected_revenue || 0), 0);

    return (
        <div className="flex flex-col h-full min-w-[280px] w-full bg-muted/30 rounded-lg p-2 border border-border/50">
            <div className="mb-3 px-2 flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-foreground/80">{STAGE_LABELS[stage]}</h3>
                <span className="text-xs text-muted-foreground font-mono">{opportunities.length}</span>
            </div>
            <div className="mb-3 px-2 text-xs font-medium text-muted-foreground">
                {formatCurrency(totalValue)}
            </div>

            <div ref={setNodeRef} className="flex-1 overflow-y-auto min-h-[100px]">
                {opportunities.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
                {opportunities.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-muted-foreground/10 rounded-lg flex items-center justify-center text-xs text-muted-foreground/50">
                        Drop here
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Board Component ---
export default function OpportunityBoard({ initialOpportunities }: { initialOpportunities: Opportunity[] }) {
    const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
    const [activeId, setActiveId] = useState<string | null>(null);

    const supabase = createClient();

    // Group by stage
    const columns = STAGE_ORDER.reduce((acc, stage) => {
        acc[stage] = opportunities.filter((o) => o.stage === stage);
        return acc;
    }, {} as Record<OpportunityStage, Opportunity[]>);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const opportunityId = active.id as string;
        const newStage = over.id as OpportunityStage;

        // Find the moved opportunity
        const opp = opportunities.find(o => o.id === opportunityId);
        if (!opp || opp.stage === newStage) return;

        // Optimistic Update
        setOpportunities(prev => prev.map(o =>
            o.id === opportunityId ? { ...o, stage: newStage } : o
        ));

        // Persist to Supabase
        const { error } = await supabase
            .from('opportunities')
            .update({ stage: newStage })
            .eq('id', opportunityId);

        if (error) {
            console.error('Failed to update stage:', error);
            // Revert verification needed in a real app
        }
    };

    const activeOpportunity = opportunities.find(o => o.id === activeId);

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-4 overflow-x-auto pb-4">
                {STAGE_ORDER.map((stage) => (
                    <KanbanColumn key={stage} stage={stage} opportunities={columns[stage]} />
                ))}
            </div>

            <DragOverlay>
                {activeId && activeOpportunity ? (
                    <div className="w-[280px] opacity-80 cursor-grabbing">
                        <Card className="shadow-xl ring-2 ring-primary">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium">{activeOpportunity.title}</CardTitle>
                                <CardDescription className="text-xs">{activeOpportunity.customers?.name}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-b-xl">
                                <span className="text-sm font-semibold">{formatCurrency(activeOpportunity.expected_revenue)}</span>
                                <Badge variant="outline" className="text-[10px] h-5">{activeOpportunity.probability}%</Badge>
                            </CardContent>
                        </Card>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
