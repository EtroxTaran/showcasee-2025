'use client';

import React from 'react';
import { APIProvider, Map, MapProps } from '@vis.gl/react-google-maps';

interface MapComponentProps extends MapProps {
    apiKey?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ apiKey, children, ...props }) => {
    const googleMapsApiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!googleMapsApiKey) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
                Google Maps API Key is missing.
            </div>
        );
    }

    return (
        <APIProvider apiKey={googleMapsApiKey}>
            <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={props.defaultCenter || { lat: 51.1657, lng: 10.4515 }} // Center of Germany
                defaultZoom={props.defaultZoom || 6}
                gestureHandling={'greedy'}
                disableDefaultUI={false}
                mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
                {...props}
            >
                {children}
            </Map>
        </APIProvider>
    );
};

export default MapComponent;
