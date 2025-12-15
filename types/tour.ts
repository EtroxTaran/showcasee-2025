import { Customer } from './customer';

export interface HotelData {
    name: string;
    address?: string;
    lat: number;
    lng: number;
    place_id?: string;
}

export type StopType = 'customer' | 'hotel';

export interface TourStop {
    id: string; // Unique ID for the stop in the list
    type: StopType;
    customer?: Customer;
    hotel?: HotelData;
}
