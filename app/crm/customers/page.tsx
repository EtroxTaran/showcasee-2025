import { createClient } from "@/utils/supabase/server";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/customers/columns";
import { Customer } from "@/types/customer";

export default async function CustomersPage() {
    const supabase = await createClient();
    const { data: customers, error } = await supabase
        .from("customers")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching customers:", error);
        return <div>Error loading customers</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            </div>
            <DataTable columns={columns} data={(customers as Customer[]) || []} />
        </div>
    );
}
