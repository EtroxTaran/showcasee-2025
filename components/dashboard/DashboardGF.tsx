'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

interface GFStats {
    total_revenue: number;
    active_projects: number;
    pipeline_breakdown: {
        stage: string;
        count: number;
        value: number;
    }[];
}

const COLORS = ['#94a3b8', '#60a5fa', '#818cf8', '#34d399', '#f87171'];

export default function DashboardGF() {
    const [stats, setStats] = useState<GFStats | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchStats() {
            const { data, error } = await supabase.rpc('get_gf_stats');
            if (error) {
                console.error('Error fetching GF stats:', error);
            } else {
                setStats(data as unknown as GFStats);
            }
            setLoading(false);
        }
        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!stats) return <div>Failed to load stats</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Executive Dashboard</h2>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue (Signed)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active_projects}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder logic for win rate if not in DB yet */}
                        <div className="text-2xl font-bold">-</div>
                        <p className="text-xs text-muted-foreground">Requires more history</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Pipeline Volume by Stage</CardTitle>
                        <CardDescription>Number of opportunities</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.pipeline_breakdown}>
                                <XAxis dataKey="stage" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {stats.pipeline_breakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Pipeline Value by Stage</CardTitle>
                        <CardDescription>Potential revenue</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.pipeline_breakdown}>
                                <XAxis dataKey="stage" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ background: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                                    formatter={(value: any) => formatCurrency(Number(value))}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {stats.pipeline_breakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
