'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Project } from '@/types/projects'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
          *,
          customers (
            name
          )
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setProjects((data as any[]) || [])
        } catch (error) {
            console.error('Error fetching projects:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'planning': return 'secondary'
            case 'in_progress': return 'default'
            case 'completed': return 'outline' // Greenish would be better but using default shadcn variants for now
            case 'cancelled': return 'destructive'
            default: return 'secondary'
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground">
                        Manage and track your ongoing projects.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Budget</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No projects found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects.map((project: any) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">{project.name}</TableCell>
                                        <TableCell>{project.customers?.name}</TableCell>
                                        <TableCell>{formatCurrency(project.budget)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(project.status) as any}>
                                                {project.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{project.start_date || '-'}</TableCell>
                                        <TableCell>{project.end_date || '-'}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
