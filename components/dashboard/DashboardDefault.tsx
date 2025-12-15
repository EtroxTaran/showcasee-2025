'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardDefault() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Welcome to Showcasee CRM</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>Select a module from the sidebar to get started.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Your role does not have a specific dashboard configured yet.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
