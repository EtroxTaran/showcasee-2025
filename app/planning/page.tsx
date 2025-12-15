'use client';

import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import { useCustomers } from '@/hooks/useCustomers';
import { useTourStore } from '@/hooks/useTour';
import { AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Customer } from '@/types/customer';

import { MyToursList } from './MyToursList';
import { ClusteredMarkers } from '@/components/tour-planning/ClusteredMarkers';

export default function PlanningPage() {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { customers, loading, error } = useCustomers();

    // Tour State
    const { stops, addCustomerStop, addHotelStop, removeStop, clearTour, optimizeTour, saveTour } = useTourStore();

    // Selection for InfoWindow
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // UI State
    const [showMyTours, setShowMyTours] = useState(false);
    const [tourName, setTourName] = useState("");
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    // Handlers
    const handleMarkerClick = (customer: Customer) => {
        setSelectedCustomer(customer);
    };

    const handleAddToTour = () => {
        if (selectedCustomer) {
            addCustomerStop(selectedCustomer);
            setSelectedCustomer(null); // Close info window after adding
        }
    };

    const handleOptimize = () => {
        optimizeTour();
    };

    const handleSaveClick = () => {
        if (stops.length === 0) return;
        setTourName(`Tour ${new Date().toLocaleDateString()}`);
        setShowSaveDialog(true);
    };

    const confirmSave = async () => {
        if (!tourName) return;
        await saveTour(tourName);
        setShowSaveDialog(false);
        // Optionally show success toast
    };

    // Metrics State for Sidebar
    const [routeMetrics, setRouteMetrics] = useState<{ distance: string; duration: string } | null>(null);

    // Inner component to handle Map interactions requiring context
    const TourDirections = ({ onMetricsUpdate }: { onMetricsUpdate: (metrics: { distance: string; duration: string } | null) => void }) => {
        const map = useMap();
        const { stops } = useTourStore();
        const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

        // Initialize DirectionsRenderer
        useEffect(() => {
            if (!map) return;
            const dr = new google.maps.DirectionsRenderer({
                map,
                suppressMarkers: true,
                preserveViewport: true,
            });
            setDirectionsRenderer(dr);
            return () => { dr.setMap(null); };
        }, [map]);

        // Update Directions
        useEffect(() => {
            if (!directionsRenderer || stops.length < 2) {
                directionsRenderer?.setDirections({ routes: [] } as any);
                onMetricsUpdate(null);
                return;
            }

            const fetchDirections = async () => {
                const directionsService = new google.maps.DirectionsService();

                const getStopLoc = (stop: (typeof stops)[0]) => {
                    if (stop.type === 'hotel' && stop.hotel && stop.hotel.lat != null && stop.hotel.lng != null) {
                        return { lat: stop.hotel.lat, lng: stop.hotel.lng };
                    }
                    if (stop.type === 'customer' && stop.customer && stop.customer.lat != null && stop.customer.lng != null) {
                        return { lat: stop.customer.lat, lng: stop.customer.lng };
                    }
                    return null;
                };

                const validStops = stops.map(getStopLoc).filter((loc): loc is google.maps.LatLngLiteral => loc !== null);

                if (validStops.length < 2) {
                    directionsRenderer?.setDirections({ routes: [] } as any);
                    onMetricsUpdate(null);
                    return;
                }

                const origin = validStops[0];
                const destination = validStops[validStops.length - 1];
                const waypoints = validStops.slice(1, -1).map(location => ({
                    location,
                    stopover: true
                }));

                try {
                    const response = await directionsService.route({
                        origin,
                        destination,
                        waypoints,
                        travelMode: google.maps.TravelMode.DRIVING,
                    });

                    directionsRenderer.setDirections(response);

                    // Calculate Totals
                    let totalDist = 0;
                    let totalDur = 0;
                    const route = response.routes[0];
                    if (route && route.legs) {
                        route.legs.forEach(leg => {
                            totalDist += leg.distance?.value || 0;
                            totalDur += leg.duration?.value || 0;
                        });
                    }

                    onMetricsUpdate({
                        distance: (totalDist / 1000).toFixed(1) + ' km',
                        duration: Math.round(totalDur / 60) + ' min'
                    });

                } catch (err) {
                    console.error("Directions request failed", err);
                    onMetricsUpdate(null); // Clear metrics on error
                }
            };

            fetchDirections();
        }, [stops, directionsRenderer, onMetricsUpdate]);

        return null;
    };

    return (
        <div className="flex h-screen flex-col relative">
            <header className="border-b bg-white p-4 shadow-sm flex justify-between items-center z-20 relative">
                <h1 className="text-xl font-bold">Tour Planning</h1>
                <div className="flex gap-2">
                    <button
                        onClick={clearTour}
                        className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                        disabled={stops.length === 0}
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => setShowMyTours(true)}
                        className="px-3 py-1 text-sm text-gray-700 border border-gray-200 rounded hover:bg-gray-50 bg-white"
                    >
                        Load Tour
                    </button>
                    <button
                        onClick={handleSaveClick}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                        disabled={stops.length === 0}
                    >
                        Save Tour
                    </button>
                </div>
            </header>
            <main className="flex-grow relative flex">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r shadow-lg z-10 flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800">Current Tour</h2>
                        <div className="flex justify-between items-center mt-1 text-sm text-gray-600">
                            <span>{stops.length} Stops</span>
                            <span>{routeMetrics ? `${routeMetrics.distance} • ${routeMetrics.duration}` : '--'}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {stops.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">
                                <p>No stops added.</p>
                                <p className="text-xs mt-2">Select a customer on the map to add to tour.</p>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {stops.map((stop, index) => (
                                    <li key={stop.id} className="bg-white border rounded-lg p-3 shadow-sm flex gap-3 items-start group">
                                        <div className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {stop.type === 'customer' ? (
                                                <>
                                                    <div className="font-medium text-gray-900 truncate">{stop.customer?.name}</div>
                                                    <div className="text-xs text-gray-500 truncate">{stop.customer?.address}</div>
                                                </>
                                            ) : (
                                                <div className="font-medium text-orange-700">🏨 Hotel Break</div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeStop(stop.id)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove stop"
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="p-4 border-t bg-gray-50">
                        <button
                            onClick={() => addHotelStop({
                                name: "Hotel / Break",
                                lat: (currentLocation?.lat || 0),
                                lng: (currentLocation?.lng || 0),
                                address: "Planned Break"
                            })}
                            className="w-full py-2 border border-dashed border-gray-300 rounded text-gray-600 hover:bg-gray-100 hover:border-gray-400 transition-colors text-sm"
                        >
                            + Add Hotel / Break
                        </button>
                        <button
                            onClick={handleOptimize}
                            className="w-full mt-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
                            disabled={stops.length < 3}
                        >
                            Optimize Route
                        </button>
                    </div>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative h-full">
                    <MapComponent
                        defaultCenter={currentLocation || { lat: 51.1657, lng: 10.4515 }}
                        defaultZoom={currentLocation ? 12 : 6}
                        controlSize={24}
                    >
                        <TourDirections onMetricsUpdate={setRouteMetrics} />

                        <ClusteredMarkers
                            customers={customers}
                            onMarkerClick={handleMarkerClick}
                        />

                        {/* Info Window for Selected Customer */}
                        {selectedCustomer && (
                            <InfoWindow
                                position={{ lat: selectedCustomer.lat!, lng: selectedCustomer.lng! }}
                                onCloseClick={() => setSelectedCustomer(null)}
                                maxWidth={300}
                            >
                                <div className="p-1 min-w-[200px]">
                                    <h3 className="font-bold text-gray-900 mb-1">{selectedCustomer.name}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{selectedCustomer.address || 'No address'}</p>

                                    <div className="flex gap-2 text-sm text-gray-500 mb-3">
                                        <span>{selectedCustomer.category || 'N/A'}</span>
                                        <span>•</span>
                                        <span>{selectedCustomer.status || 'Active'}</span>
                                    </div>

                                    {stops.some(s => s.customer?.id === selectedCustomer.id) ? (
                                        <div className="text-green-600 font-medium text-sm text-center border border-green-200 bg-green-50 py-1.5 rounded">
                                            Added to Tour
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleAddToTour}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded text-sm transition-colors"
                                        >
                                            Add to Tour
                                        </button>
                                    )}
                                </div>
                            </InfoWindow>
                        )}
                    </MapComponent>

                    {/* Overlays */}
                    {showMyTours && (
                        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <MyToursList onClose={() => setShowMyTours(false)} />
                        </div>
                    )}

                    {showSaveDialog && (
                        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                                <h3 className="text-lg font-bold mb-4">Save Tour</h3>
                                <input
                                    type="text"
                                    value={tourName}
                                    onChange={(e) => setTourName(e.target.value)}
                                    className="w-full border p-2 rounded mb-4"
                                    placeholder="Enter tour name..."
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowSaveDialog(false)}
                                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmSave}
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
