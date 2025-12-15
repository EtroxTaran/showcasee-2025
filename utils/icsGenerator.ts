
import { createEvents, EventAttributes } from 'ics';
import { TourStop } from '@/types/tour';

type SavedTour = {
    id: string;
    name: string;
    updated_at: string;
    status: string;
};

export const generateTourIcs = async (tour: SavedTour, stops: TourStop[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        const events: EventAttributes[] = [];

        // Start tour tomorrow at 08:00 AM if no date is stored, 
        // or just use tomorrow's date for MVP as we don't store tour dates in `tours` table proper yet (it's in tour_days).
        // Since we are fetching just stops, let's assume "Tomorrow" for the export
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(8, 0, 0, 0);

        let currentTime = startDate.getTime();

        stops.forEach((stop, index) => {
            // Estimate travel time (skip for first stop)
            if (index > 0) {
                // Assuming 30 mins travel time between stops for MVP estimation
                // In reality we would use Google Maps duration if stored
                currentTime += 30 * 60 * 1000;
            }

            const start = new Date(currentTime);
            // Default 30 mins duration per stop
            const durationMinutes = 30;
            const end = new Date(currentTime + durationMinutes * 60 * 1000);

            // Construct address/location string
            let location = '';
            let description = '';
            let title = '';

            if (stop.type === 'customer' && stop.customer) {
                title = `Visit: ${stop.customer.name}`;
                location = `${stop.customer.address}`; // Ensure valid string
                description = `Customer: ${stop.customer.name}\nPhone: ${stop.customer.phone || 'N/A'}\nNotes: ${stop.customer.category || ''}`;
            } else if (stop.type === 'hotel' && stop.hotel) {
                title = `Hotel: ${stop.hotel.name}`;
                location = `${stop.hotel.address}`;
                description = `Stay at ${stop.hotel.name}`;
            }

            // Create event
            // ics package expects [year, month, day, hour, minute]
            const event: EventAttributes = {
                start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
                duration: { minutes: durationMinutes },
                title: title || 'Tour Stop',
                description: description,
                location: location,
                status: 'CONFIRMED',
                busyStatus: 'BUSY',
                geo: (stop.type === 'customer' && stop.customer) ? { lat: stop.customer.lat, lon: stop.customer.lng } :
                    (stop.type === 'hotel' && stop.hotel) ? { lat: stop.hotel.lat, lon: stop.hotel.lng } : undefined
            };

            events.push(event);

            // Update current time for next stop (add duration of this stop)
            currentTime += durationMinutes * 60 * 1000;
        });

        createEvents(events, (error, value) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(value);
        });
    });
};
