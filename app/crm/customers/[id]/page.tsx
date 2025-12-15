import { createClient } from "@/utils/supabase/server";
import { CustomerDetailHeader } from "@/components/customers/customer-detail-header";
import { CustomerInfoCard } from "@/components/customers/customer-info-card";
import { InteractionList } from "@/components/customers/interaction-list";
import { InteractionForm } from "@/components/customers/interaction-form";
import { Interaction, Customer } from "@/types/customer";
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient();

    const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (customerError || !customer) {
        notFound();
    }

    const { data: interactions, error: interactionsError } = await supabase
        .from("interactions")
        .select("*")
        .eq("customer_id", id)
        .order("date", { ascending: false });

    if (interactionsError) {
        console.error("Error fetching interactions:", interactionsError);
    }

    return (
        <div className="container mx-auto py-10 space-y-8">
            <CustomerDetailHeader customer={customer as Customer} />
            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <CustomerInfoCard customer={customer as Customer} />

                    <div className="grid gap-6">
                        <InteractionForm customerId={id} />
                        <InteractionList interactions={(interactions as Interaction[]) || []} />
                    </div>

                    {/* Placeholder for Map Logic - simplified for now */}
                    <div className="h-64 bg-muted rounded-md flex items-center justify-center border">
                        <p className="text-muted-foreground">Map Preview Placeholder</p>
                        {/* 
                   Potential Future Implementation: 
                   <MapPreview lat={customer.lat} lng={customer.lng} /> 
                */}
                    </div>
                </div>

                <div>
                    {/* Sidebar Area - maybe move interaction list here if it gets long, or keep specific stats here */}
                </div>
            </div>
        </div>
    );
}
