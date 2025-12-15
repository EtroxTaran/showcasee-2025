import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useTourStore } from '@/hooks/useTour';
import { generateTourIcs } from '@/utils/icsGenerator';
import { TourStop } from '@/types/tour';

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

    const handleExport = async (tour: SavedTour) => {
        try {
            // Fetch tour data to generate ICS
            // We duplicate basic fetch logic here to avoid loading into main state or refactoring store yet
            const { data: days } = await supabase
                .from('tour_days')
                .select('id')
                .eq('tour_id', tour.id)
                .order('day_number', { ascending: true });

            if (!days || days.length === 0) {
                alert('No tour days found to export.');
                return;
            }

            const dayId = days[0].id;
            const { data: stopsData, error: stopsError } = await supabase
                .from('tour_stops')
                .select(`
                    id,
                    type,
                    sequence_order,
                    place_id,
                    name,
                    lat,
                    lng,
                    address,
                    customer:customers (
                        id,
                        name,
                        address,
                        lat,
                        lng,
                        category,
                        status,
                        email,
                        phone,
                        website
                    )
                `)
                .eq('tour_day_id', dayId)
                .order('sequence_order', { ascending: true });

            if (stopsError) throw stopsError;

            const transformStop = (stop: any): TourStop => {
                if (stop.type === 'customer' && stop.customer) {
                    return {
                        id: stop.id,
                        type: 'customer',
                        customer: {
                            id: stop.customer.id,
                            name: stop.customer.name,
                            address: stop.customer.address,
                            lat: stop.customer.lat,
                            lng: stop.customer.lng,
                            category: stop.customer.category,
                            status: stop.customer.status,
                            email: stop.customer.email,
                            phone: stop.customer.phone,
                            website: stop.customer.website
                        }
                    };
                } else {
                    return {
                        id: stop.id,
                        type: stop.type as 'hotel',
                        hotel: {
                            name: stop.name || 'Unknown Stop',
                            address: stop.address || '',
                            lat: stop.lat || 0,
                            lng: stop.lng || 0,
                            place_id: stop.place_id || undefined
                        }
                    };
                }
            };

            const stops = stopsData ? stopsData.map(transformStop) : [];
            const icsContent = await generateTourIcs(tour, stops);
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });

            // Trigger download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${tour.name.replace(/\s+/g, '_')}.ics`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export tour.");
        }
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
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleExport(tour)}
                                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200"
                                >
                                    Export
                                </button>
                                <button
                                    onClick={() => handleLoad(tour.id)}
                                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200"
                                >
                                    Load
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
