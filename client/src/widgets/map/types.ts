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

export interface SearchResult {
  lat: number;
  lng: number;
  displayName: string;
}

export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export interface OverpassElement {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export interface OverpassResponse {
  elements: OverpassElement[];
}

export type InfraScope = 'merged-all' | 'single-house' | 'search';
