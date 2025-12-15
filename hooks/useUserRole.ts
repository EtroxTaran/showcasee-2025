'use client'

import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/supabase'
import { useEffect, useState } from 'react'

type UserRole = Database['public']['Enums']['user_role']

export function useUserRole() {
    const [role, setRole] = useState<UserRole | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchRole() {
            setLoading(true)
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser()

                if (user) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single()

                    if (!error && data) {
                        setRole(data.role)
                    }
                }
            } catch (error) {
                console.error('Error fetching user role:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchRole()
    }, [supabase])

    return {
        role,
        loading,
        isAdmin: role === 'ADM',
        isGF: role === 'GF',
        isPlanner: role === 'PLAN',
        isSales: role === 'KALK', // KALK is Estimator/Sales per PRD
        isAccountant: role === 'BUCH',
    }
}
