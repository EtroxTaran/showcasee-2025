import { optimizeTourStops } from './tourOptimization';
import { TourStop } from '@/types/tour';

// Mock Stops
const hotelA: TourStop = { id: 'h1', type: 'hotel', hotel: { name: 'H1', lat: 0, lng: 0 } };
const hotelB: TourStop = { id: 'h2', type: 'hotel', hotel: { name: 'H2', lat: 10, lng: 10 } };

const stop1: TourStop = { id: 's1', type: 'customer', customer: { id: 'c1', name: 'C1', lat: 1, lng: 1 } as any };
const stop2: TourStop = { id: 's2', type: 'customer', customer: { id: 'c2', name: 'C2', lat: 5, lng: 5 } as any };
const stop3: TourStop = { id: 's3', type: 'customer', customer: { id: 'c3', name: 'C3', lat: 2, lng: 2 } as any };

// Simple manual test runner since no test framework is installed
const runTests = () => {
    console.log("Running Tour Optimization Tests...");

    // Test 1: Empty or single stop should return as is
    const res1 = optimizeTourStops([]);
    console.assert(res1.length === 0, "Test 1 Failed: Should handle empty list");

    // Test 2: Two stops should stay as is
    const res2 = optimizeTourStops([stop1, stop2]);
    console.assert(res2.length === 2, "Test 2 Failed: Should handle 2 stops");

    // Test 3: Hotel - Stop - Stop - Hotel (Simple Segment)
    // Order input: H1 -> S2 (5,5) -> S1 (1,1) -> H2
    // Expected: H1(0,0) -> S1(1,1) -> S2(5,5) -> H2
    const stops3 = [hotelA, stop2, stop1, hotelB];
    const res3 = optimizeTourStops(stops3);

    console.log("Test 3 Result IDs:", res3.map(s => s.id));
    console.assert(res3[0].id === 'h1', "Test 3 Failed: Start should be H1");
    // H1 (0,0) -> Closest is S1 (1,1) (dist ~1.4) vs S2 (5,5) (dist ~7)
    console.assert(res3[1].id === 's1', "Test 3 Failed: Second should be S1");
    console.assert(res3[2].id === 's2', "Test 3 Failed: Third should be S2");
    console.assert(res3[3].id === 'h2', "Test 3 Failed: End should be H2");

    console.log("Tests Completed.");
};

// Uncomment to run if executing file directly
// runTests();
