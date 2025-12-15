import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useTourStore } from '@/hooks/useTour';

type SavedTour = {
    id: string;
    name: string;
    updated_at: string;
    status: string;
    total_duration: number;
    total_distance: number;
};

interface MyToursListProps {
    onClose: () => void;
}

export function MyToursList({ onClose }: MyToursListProps) {
    const [tours, setTours] = useState<SavedTour[]>([]);
    const [loading, setLoading] = useState(true);
    const { loadTour } = useTourStore();
    const supabase = createClient();

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('tours')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setTours(data as any);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLoad = async (id: string) => {
        await loadTour(id);
        onClose();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl border w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Saved Tours</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading tours...</div>
            ) : tours.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No saved tours found.</div>
            ) : (
                <ul className="space-y-3">
                    {tours.map(tour => (
                        <li key={tour.id} className="border p-4 rounded hover:bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-800">{tour.name}</h3>
                                <div className="text-xs text-gray-500 mt-1">
                                    Last update: {new Date(tour.updated_at).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Status: {tour.status}
                                </div>
                            </div>
                            <button
                                onClick={() => handleLoad(tour.id)}
                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200"
                            >
                                Load
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
