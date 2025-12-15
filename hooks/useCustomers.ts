'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Customer } from '@/types/customer';

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCustomers() {
            try {
                setLoading(true);
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('customers')
                    .select('*')
                    // Filter for customers with valid coordinates for the map
                    .not('lat', 'is', null)
                    .not('lng', 'is', null);

                if (error) {
                    throw error;
                }

                setCustomers(data as Customer[]);
            } catch (err) {
                console.error('Error fetching customers:', err);
                setError('Failed to load customers');
            } finally {
                setLoading(false);
            }
        }

        fetchCustomers();
    }, []);

    return { customers, loading, error };
}
