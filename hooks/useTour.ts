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

            // 2. Create Tour Day (Assume single day for MVP or manage days)
            // For MVP we just put all stops in Day 1 unless we have logic to split.
            // The DB requires tour_days. Let's create one day.
            // Check if day exists? simpler to delete old days/stops and recreate for full sync if easy.
            // Or just upsert.
            // Strategy: Delete existing days/stops for this tour and recreate. (Simplest for MVP sync)

            if (currentTourId) {
                // Delete old structure
                await supabase.from('tour_days').delete().eq('tour_id', currentTourId);

                // Create Day 1
                const { data: dayData, error: dayError } = await supabase.from('tour_days').insert({
                    tour_id: currentTourId,
                    day_number: 1,
                    date: new Date().toISOString().split('T')[0], // Today
                }).select().single();

                if (dayError) throw dayError;
                const dayId = dayData.id;

                // Create Stops
                const stopsPayload = stops.map((stop, index) => ({
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

                const { error: stopsError } = await supabase.from('tour_stops').insert(stopsPayload);
                if (stopsError) throw stopsError;
            }

        } catch (error) {
            console.error("Error saving tour:", error);
            // Handle error state?
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

            // 3. Get Stops for first day (MVP)
            // In future iterate all days.
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
                        type: stop.type as 'hotel', // Cast to hotel/stop type
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

            const loadedStops = stopsData ? stopsData.map(transformStop) : [];

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
