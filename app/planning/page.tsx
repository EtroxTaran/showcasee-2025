'use client';

import React, { useState, useEffect } from 'react';
import MapComponent from '@/components/MapComponent';
import { useCustomers } from '@/hooks/useCustomers';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

export default function PlanningPage() {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { customers, loading, error } = useCustomers();

    useEffect(() => {
        if (navigator.geolocation) {
            // ... existing geolocation code ...
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

    return (
        <div className="flex h-screen flex-col">
            <header className="border-b bg-white p-4 shadow-sm">
                <h1 className="text-xl font-bold">Tour Planning</h1>
            </header>
            <main className="flex-grow relative">
                {/* Sidebar placeholder - to be implemented in future tasks */}
                <div className="absolute left-4 top-4 z-10 w-80 rounded-lg bg-white p-4 shadow-lg hidden md:block opacity-90 hover:opacity-100 transition-opacity">
                    <h2 className="mb-2 text-lg font-semibold">Stops</h2>
                    <p className="text-sm text-gray-500">No stops added yet.</p>
                </div>

                <div className="h-full w-full">
                    <MapComponent
                        defaultCenter={currentLocation || { lat: 51.1657, lng: 10.4515 }}
                        defaultZoom={currentLocation ? 12 : 6}
                        controlSize={24}
                    >
                        {customers.map((customer) => (
                            <AdvancedMarker
                                key={customer.id}
                                position={{ lat: customer.lat!, lng: customer.lng! }}
                                title={customer.name}
                            >
                                <div className="text-2xl">📍</div>
                            </AdvancedMarker>
                        ))}
                    </MapComponent>
                </div>
            </main>
        </div>
    );
}
