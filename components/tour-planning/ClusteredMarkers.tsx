'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Customer } from '@/types/customer';
import { useTourStore } from '@/hooks/useTour';

type ClusteredMarkersProps = {
    customers: Customer[];
    onMarkerClick: (customer: Customer) => void;
};

export const ClusteredMarkers = ({ customers, onMarkerClick }: ClusteredMarkersProps) => {
    const map = useMap();
    const clusterer = useRef<MarkerClusterer | null>(null);
    const [markers, setMarkers] = useState<{ [key: string]: google.maps.marker.AdvancedMarkerElement }>({});
    const { stops } = useTourStore();

    // Initialize clusterer
    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    // Update markers in clusterer
    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: google.maps.marker.AdvancedMarkerElement | null, key: string) => {
        if (marker && markers[key] !== marker) {
            setMarkers((prev) => {
                if (prev[key] === marker) return prev;
                return { ...prev, [key]: marker };
            });
        }
        // Cleanup not strictly necessary as React handles unmounts, calls ref with null? 
        // Actually ref logic with state is tricky. 
        // If marker is null (unmounting), we should remove it?
        // But the useEffect clears all and re-adds Object.values.
        // So if we remove from state, it updates clusterer.
        if (!marker) {
            setMarkers((prev) => {
                const newMarkers = { ...prev };
                delete newMarkers[key];
                return newMarkers;
            });
        }
    };

    return (
        <>
            {customers.map((customer) => (
                <AdvancedMarker
                    key={customer.id}
                    position={{ lat: customer.lat!, lng: customer.lng! }}
                    ref={(marker) => setMarkerRef(marker, customer.id)}
                    onClick={() => onMarkerClick(customer)}
                    title={customer.name}
                >
                    <div className="text-2xl cursor-pointer hover:scale-110 transition-transform">
                        {stops.some(s => s.customer?.id === customer.id) ? '✅' : '📍'}
                    </div>
                </AdvancedMarker>
            ))}
        </>
    );
};
