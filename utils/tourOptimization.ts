import { TourStop } from '@/types/tour';
import { Customer } from '@/types/customer';

/**
 * Calculates straight-line distance between two points in km
 */
const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const getStopLocation = (stop: TourStop): { lat: number; lng: number } | null => {
    if (stop.type === 'hotel' && stop.hotel) {
        return { lat: stop.hotel.lat, lng: stop.hotel.lng };
    }
    if (stop.type === 'customer' && stop.customer) { // Check if customer exists
        // The Customer interface in `hooks/useTour` usage seems to have lat/lng directly
        // but let's be safe and check.
        const lat = stop.customer.lat;
        const lng = stop.customer.lng;
        if (lat != null && lng != null) {
            return { lat, lng };
        }
    }
    return null;
};

/**
 * Optimizes the tour order using Nearest Neighbor algorithm.
 * Respects 'hotel' stops as fixed anchor points (day breakers).
 * Optimizes the route segments BETWEEN hotels.
 */
export const optimizeTourStops = (stops: TourStop[]): TourStop[] => {
    if (stops.length <= 2) return stops;

    // Split stops by 'hotel' type to create segments
    const segments: TourStop[][] = [];
    let currentSegment: TourStop[] = [];

    stops.forEach(stop => {
        if (stop.type === 'hotel') {
            if (currentSegment.length > 0) {
                segments.push(currentSegment);
            }
            segments.push([stop]); // Hotel is its own segment/separator
            currentSegment = [];
        } else {
            currentSegment.push(stop);
        }
    });
    if (currentSegment.length > 0) {
        segments.push(currentSegment);
    }

    // Optimize each segment that is NOT a single hotel
    const optimizedSegments = segments.map(segment => {
        if (segment.length <= 1 || segment[0].type === 'hotel') return segment;

        // Nearest neighbor optimization for this segment
        // Start with the first stop in the segment (assume it's fixed start of this leg)
        // Or should we assume user starts from current location?
        // For MVP, we assume the user added stops in a rough order, keeping the *first* one
        // as the starting point of that day/segment might be logical, OR we optimize all.
        // Let's keep the first one fixed as "start" if it's the very first segment of the tour.
        // If it's a segment AFTER a hotel, the hotel was the previous point, so we optimize from there.
        // Actually, let's just optimize the WHOLE segment assuming the *previous* point (end of last segment)
        // determines the start of this one.

        // Simpler approach: Keep first point fixed, optimize rest.
        // If it's the very first segment, first stop is start.
        // If it's after a hotel, the hotel was the start.

        // We'll reimplement:
        // 1. We need the context of "where we are coming from".
        return optimizeSegment(segment);
    });

    // We need to actually link the segments.
    // However, the segments.map approach above is stateless between segments.
    // Better: Iterate and optimize.

    // Let's refine:
    // We assume the first stop in the LIST is the start point (or we need user location passed in).
    // The issue says "Nearest-neighbor sort".

    // Strategy:
    // 1. Identify "fixed" points: Hotels.
    // 2. Everything between hotels (or start/end) is a sub-route to optimize.
    // 3. For a sub-route, we need a start point (the previous hotel or the first stop).

    // Let's do a pass that optimizes chunks.
    let optimizedTour: TourStop[] = [];

    // Find indices of hotels
    const hotelIndices = stops.map((s, i) => s.type === 'hotel' ? i : -1).filter(i => i !== -1);

    // Add -1 (start) and length (end) as virtual boundaries if not present
    let boundaries = [-1, ...hotelIndices, stops.length];

    // Dedup boundaries
    boundaries = Array.from(new Set(boundaries)).sort((a, b) => a - b);


    // For each interval between boundaries
    for (let i = 0; i < boundaries.length - 1; i++) {
        const startIdx = boundaries[i]; // Exclusive (unless -1)
        const endIdx = boundaries[i + 1]; // Exclusive (unless it's a hotel, then it is the end anchor)

        // Items to optimize: (startIdx + 1) to (endIdx - 1)
        // The stop at startIdx (if >=0) is the "origin" for NN.
        // If startIdx is -1, we assume the first stop in the range is the origin (keep it fixed).

        const rangeStart = startIdx + 1;
        const rangeEnd = endIdx;

        if (rangeStart >= rangeEnd) {
            // Nothing in this range (e.g. two hotels next to each other)
            // But we need to add the hotel at endIdx if it exists and hasn't been added.
            // (Hotels are boundaries, we append them after processing the range)
            if (endIdx < stops.length && stops[endIdx].type === 'hotel') {
                // But wait, the loop structure handles the content *between*.
            }
            continue;
        }

        let segmentStops = stops.slice(rangeStart, rangeEnd);

        // If this is a valid segment with > 1 stops
        if (segmentStops.length > 1) {
            let originLoc: { lat: number, lng: number } | null = null;

            if (startIdx >= 0) {
                // Origin is the hotel/stop at startIdx
                originLoc = getStopLocation(stops[startIdx]);
            } else {
                // First segment. Origin is the first stop itself (keep fixed) OR user location.
                // Let's keep the first one fixed for stability.
                originLoc = getStopLocation(segmentStops[0]);
                // Remove first stop from optimization pool, add it back later
                // optimizedTour.push(segmentStops[0]); 
                // segmentStops = segmentStops.slice(1);
            }

            if (originLoc) {
                segmentStops = nearestNeighbor(segmentStops, originLoc);
            }
        }

        // Add optimized segment to result
        optimizedTour.push(...segmentStops);

        // Add the boundary stop (Hotel) if it's not the end of array
        if (endIdx < stops.length) {
            optimizedTour.push(stops[endIdx]);
        }
    }

    return optimizedTour;
};

const nearestNeighbor = (stops: TourStop[], startLocation: { lat: number; lng: number }): TourStop[] => {
    const sorted: TourStop[] = [];
    let currentLoc = startLocation;
    const remaining = [...stops];

    // If the first stop was the startLocation (e.g. first segment), it might be handled outside.
    // If not, we just pick closest to currentLoc.

    while (remaining.length > 0) {
        let closestIdx = -1;
        let minDist = Infinity;

        remaining.forEach((stop, index) => {
            const loc = getStopLocation(stop);
            if (loc) {
                const dist = getDistance(currentLoc.lat, currentLoc.lng, loc.lat, loc.lng);
                if (dist < minDist) {
                    minDist = dist;
                    closestIdx = index;
                }
            } else {
                // No location? Just append it?
            }
        });

        if (closestIdx !== -1) {
            const nearest = remaining[closestIdx];
            sorted.push(nearest);
            const loc = getStopLocation(nearest);
            if (loc) currentLoc = loc;
            remaining.splice(closestIdx, 1);
        } else {
            // Should not happen unless no location data
            // Append rest
            sorted.push(...remaining);
            break;
        }
    }
    return sorted;
};

// Simplified optimization for segment
const optimizeSegment = (segment: TourStop[]): TourStop[] => {
    // Basic fallback if simple mapping used previously
    // This is not used in the main logic above which is more robust
    return segment;
}
