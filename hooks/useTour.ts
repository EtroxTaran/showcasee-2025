import { create } from 'zustand';
import { Customer } from '@/types/customer';
import { TourStop, HotelData } from '@/types/tour';
import { optimizeTourStops } from '@/utils/tourOptimization';
import { createClient } from '@/utils/supabase/client';

interface TourState {
    stops: TourStop[];
    tourId: string | null;
    status: 'draft' | 'finalized' | 'completed';
    isSaving: boolean;

    // Actions
    addCustomerStop: (customer: Customer) => void;
    addHotelStop: (hotel: HotelData) => void;
    removeStop: (stopId: string) => void;
    clearTour: () => void;
    optimizeTour: () => void;
    saveTour: (name: string) => Promise<void>;
    loadTour: (tourId: string) => Promise<void>;
}

export const useTourStore = create<TourState>((set, get) => ({
    stops: [],
    tourId: null,
    status: 'draft',
    isSaving: false,

    addCustomerStop: (customer) => set((state) => ({
        stops: [
            ...state.stops,
            {
                id: crypto.randomUUID(),
                type: 'customer',
                customer,
            }
        ]
    })),

    addHotelStop: (hotel) => set((state) => ({
        stops: [
            ...state.stops,
            {
                id: crypto.randomUUID(),
                type: 'hotel',
                hotel,
            }
        ]
    })),

    removeStop: (stopId) => set((state) => ({
        stops: state.stops.filter((s) => s.id !== stopId)
    })),

    clearTour: () => set({ stops: [], tourId: null, status: 'draft' }),

    optimizeTour: () => {
        const { stops } = get();
        const optimized = optimizeTourStops(stops);
        set({ stops: optimized });
    },

    saveTour: async (name: string) => {
        set({ isSaving: true });
        const { stops, tourId, status } = get();
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user logged in");

            let currentTourId = tourId;

            // 1. Create or Update Tour
            const tourData = {
                user_id: user.id,
                name: name,
                status: status,
                updated_at: new Date().toISOString(),
            };

            if (currentTourId) {
                await supabase.from('tours').update(tourData).eq('id', currentTourId);
            } else {
                const { data, error } = await supabase.from('tours').insert(tourData).select().single();
                if (error) throw error;
                currentTourId = data.id;
                set({ tourId: currentTourId });
            }

            if (currentTourId) {
                // Delete old structure (days & stops cascade)
                await supabase.from('tour_days').delete().eq('tour_id', currentTourId);

                // Split stops into days
                // Logic: A 'hotel' stop ends the current day.
                const daysChunks: TourStop[][] = [];
                let currentChunk: TourStop[] = [];

                stops.forEach(stop => {
                    currentChunk.push(stop);
                    if (stop.type === 'hotel') {
                        daysChunks.push(currentChunk);
                        currentChunk = [];
                    }
                });
                if (currentChunk.length > 0) {
                    daysChunks.push(currentChunk);
                }

                // Process each day
                for (let i = 0; i < daysChunks.length; i++) {
                    const chunk = daysChunks[i];
                    const dayNumber = i + 1;

                    // Create Day
                    const { data: dayData, error: dayError } = await supabase.from('tour_days').insert({
                        tour_id: currentTourId,
                        day_number: dayNumber,
                        date: new Date().toISOString().split('T')[0], // For MVP, just today. In real app, increment date.
                    }).select().single();

                    if (dayError) throw dayError;
                    const dayId = dayData.id;

                    // Create Stops for this day
                    const stopsPayload = chunk.map((stop, index) => ({
                        tour_day_id: dayId,
                        customer_id: stop.type === 'customer' ? stop.customer?.id : null,
                        place_id: stop.type === 'hotel' ? stop.hotel?.place_id : null,
                        type: stop.type,
                        sequence_order: index,
                        name: stop.type === 'hotel' ? stop.hotel?.name : stop.customer?.name,
                        lat: stop.type === 'hotel' ? stop.hotel?.lat : stop.customer?.lat,
                        lng: stop.type === 'hotel' ? stop.hotel?.lng : stop.customer?.lng,
                        address: stop.type === 'hotel' ? stop.hotel?.address : stop.customer?.address,
                    }));

                    if (stopsPayload.length > 0) {
                        const { error: stopsError } = await supabase.from('tour_stops').insert(stopsPayload);
                        if (stopsError) throw stopsError;
                    }
                }
            }

        } catch (error) {
            console.error("Error saving tour:", error);
        } finally {
            set({ isSaving: false });
        }
    },

    loadTour: async (tourId: string) => {
        set({ isSaving: true });
        const supabase = createClient();
        try {
            // 1. Get Tour Details
            const { data: tour, error: tourError } = await supabase
                .from('tours')
                .select('*')
                .eq('id', tourId)
                .single();

            if (tourError) throw tourError;

            // 2. Get Tour Days (Just take the first one or all?)
            const { data: days, error: daysError } = await supabase
                .from('tour_days')
                .select('id, day_number')
                .eq('tour_id', tourId)
                .order('day_number', { ascending: true });

            if (daysError) throw daysError;

            if (!days || days.length === 0) {
                set({ stops: [], tourId: tour.id, status: tour.status as any, isSaving: false });
                return;
            }

            // 3. Get Stops for ALL days
            // We fetch all days, then fetch all stops for those days.
            const dayIds = days.map((d: any) => d.id);
            const { data: stopsData, error: stopsError } = await supabase
                .from('tour_stops')
                .select(`
                    id,
                    type,
                    sequence_order,
                    tour_day_id,
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
                .in('tour_day_id', dayIds)
                .order('tour_day_id', { ascending: true }) // Sort by days first...
                .order('sequence_order', { ascending: true }); // ...then by sequence

            if (stopsError) throw stopsError;

            // Reconstruct single list.
            // Since we sort by day_id and then sequence, this works IF dayIds are sorted.
            // But dayIds are UUIDs. We need to map dayId -> dayNumber to sort correctly.
            // `days` array is ordered by day_number.

            const dayOrderMap = new Map(days.map((d: any) => [d.id, d.day_number]));

            const sortedStopsData = (stopsData || []).sort((a: any, b: any) => {
                const dayA = dayOrderMap.get(a.tour_day_id) || 0;
                const dayB = dayOrderMap.get(b.tour_day_id) || 0;
                if (dayA !== dayB) return dayA - dayB;
                return a.sequence_order - b.sequence_order;
            });

            // 4. Transform to TourStop
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
                    // Hotel or location
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

            const loadedStops = sortedStopsData.map(transformStop);

            set({
                stops: loadedStops,
                tourId: tour.id,
                status: tour.status as any
            });

        } catch (error) {
            console.error("Error loading tour:", error);
        } finally {
            set({ isSaving: false });
        }
    }
}));
