'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { Loader2, Calendar, MapPin } from 'lucide-react';

interface SalesStats {
    my_pipeline_value: number;
    my_won_count: number;
}

interface Tour {
    id: string;
    name: string;
    start_date: string; // From tour_days usually, but tours table might not have date. 
    // Wait, tours table doesn't have date directly, it has tour_days.
    // Simplifying: Fetch "Today's Tour" or "Next Tour" from tour_days where user is owner.
}

export default function DashboardSales() {
    const [stats, setStats] = useState<SalesStats | null>(null);
    const [upcomingTours, setUpcomingTours] = useState<any[]>([]); // simplified type for now
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // Stats
            const statsRes = await supabase.rpc('get_sales_stats');
            if (statsRes.data) setStats(statsRes.data as unknown as SalesStats);

            // Upcoming Tours (Next 5 Days)
            // Querying tour_days linked to tours where user_id = auth.uid()
            // This requires joining tables. Supabase client simple select might struggle with complex join deep filtering if RLS isn't limiting tours first.
            // But tours has RLS.
            // Let's try fetching tours first.
            const { data: tours } = await supabase
                .from('tours')
                .select(`
                    id, 
                    name, 
                    tour_days (
                        date,
                        id
                    )
                `)
                .eq('status', 'planned') // Assuming 'planned'
                .limit(5);

            if (tours) {
                // Flatten and sort by date
                const days = tours.flatMap(t =>
                    t.tour_days.map((d: any) => ({
                        tourName: t.name,
                        date: d.date,
                        tourId: t.id
                    }))
                ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .filter(d => new Date(d.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
                    .slice(0, 5);

                setUpcomingTours(days);
            }

            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Sales Dashboard</h2>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Pipeline Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats?.my_pipeline_value || 0)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Deals Won</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.my_won_count || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Tours */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Tours</CardTitle>
                    <CardDescription>Your schedule for next days</CardDescription>
                </CardHeader>
                <CardContent>
                    {upcomingTours.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No upcoming tours planned.</p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingTours.map((tour, i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <Calendar className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{tour.tourName}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(tour.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {/* Action button mock */}
                                    <div className="text-xs bg-muted px-2 py-1 rounded">View</div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
