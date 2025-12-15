'use client';

import { useUserRole } from "@/hooks/useUserRole";
import DashboardGF from "@/components/dashboard/DashboardGF";
import DashboardSales from "@/components/dashboard/DashboardSales";
import DashboardDefault from "@/components/dashboard/DashboardDefault";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { isGF, isAdmin, isSales, loading } = useUserRole();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isGF || isAdmin) {
    return <DashboardGF />;
  }

  if (isSales) {
    return <DashboardSales />;
  }

  return <DashboardDefault />;
}
