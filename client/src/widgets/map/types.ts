export interface GeocodedHouse {
  id: string;
  street: string;
  apartmentName: string;
  lat: number;
  lng: number;
  geocodeStatus: 'pending' | 'success' | 'error';
}

export type POICategory =
  | 'shop'
  | 'supermarket'
  | 'bus_stop'
  | 'pharmacy'
  | 'hospital'
  | 'cafe'
  | 'restaurant'
  | 'bank'
  | 'atm'
  | 'other';

export interface POI {
  id: number;
  name: string;
  category: POICategory;
  lat: number;
  lng: number;
  tags: Record<string, string>;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

export type InfraScope = 'merged-all' | 'single-house' | 'search';
