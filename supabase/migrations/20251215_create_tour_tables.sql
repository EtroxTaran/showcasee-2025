-- Create tours table
CREATE TABLE public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'finalized', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tour_days table
CREATE TABLE public.tour_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE,
    total_distance_meters INTEGER DEFAULT 0,
    total_duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tour_stops table
CREATE TABLE public.tour_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_day_id UUID NOT NULL REFERENCES public.tour_days(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    place_id TEXT, -- For Google Places ID if it's a hotel or prospect not in DB
    type TEXT NOT NULL CHECK (type IN ('customer', 'hotel', 'prospect', 'location')),
    sequence_order INTEGER NOT NULL,
    arrival_time TIMESTAMPTZ,
    duration_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_stops ENABLE ROW LEVEL SECURITY;

-- Policies for tours
CREATE POLICY "Users can view their own tours" ON public.tours
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tours" ON public.tours
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tours" ON public.tours
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tours" ON public.tours
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for tour_days (via tour ownership)
CREATE POLICY "Users can view their tour days" ON public.tour_days
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.tours WHERE tours.id = tour_days.tour_id AND tours.user_id = auth.uid())
    );

CREATE POLICY "Users can insert their tour days" ON public.tour_days
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.tours WHERE tours.id = tour_days.tour_id AND tours.user_id = auth.uid())
    );

CREATE POLICY "Users can update their tour days" ON public.tour_days
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.tours WHERE tours.id = tour_days.tour_id AND tours.user_id = auth.uid())
    );

CREATE POLICY "Users can delete their tour days" ON public.tour_days
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.tours WHERE tours.id = tour_days.tour_id AND tours.user_id = auth.uid())
    );

-- Policies for tour_stops (via tour_day -> tour ownership)
CREATE POLICY "Users can view their tour stops" ON public.tour_stops
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tour_days
            JOIN public.tours ON tours.id = tour_days.tour_id
            WHERE tour_days.id = tour_stops.tour_day_id AND tours.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their tour stops" ON public.tour_stops
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tour_days
            JOIN public.tours ON tours.id = tour_days.tour_id
            WHERE tour_days.id = tour_stops.tour_day_id AND tours.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their tour stops" ON public.tour_stops
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.tour_days
            JOIN public.tours ON tours.id = tour_days.tour_id
            WHERE tour_days.id = tour_stops.tour_day_id AND tours.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their tour stops" ON public.tour_stops
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.tour_days
            JOIN public.tours ON tours.id = tour_days.tour_id
            WHERE tour_days.id = tour_stops.tour_day_id AND tours.user_id = auth.uid()
        )
    );
