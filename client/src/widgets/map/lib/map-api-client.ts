import { getClientApiBaseUrl } from '@/shared/constants/api-base-url';
import { tokenStorage } from '@/shared/utils/auth';
import type { GeocodeResult, POI } from '../types';

function authHeaders(): HeadersInit {
  const token = tokenStorage.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const base = getClientApiBaseUrl();

export async function fetchPoi(lat: number, lng: number): Promise<POI[]> {
  const url = `${base}/map/poi?lat=${lat}&lng=${lng}`;
  const res = await fetch(url, { headers: authHeaders(), credentials: 'include' });
  if (!res.ok) throw new Error(`POI fetch error: ${res.status}`);
  return res.json() as Promise<POI[]>;
}

export async function fetchPoiBulk(points: { lat: number; lng: number }[]): Promise<POI[]> {
  const url = `${base}/map/poi/bulk`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    credentials: 'include',
    body: JSON.stringify({ points }),
  });
  if (!res.ok) throw new Error(`POI bulk fetch error: ${res.status}`);
  return res.json() as Promise<POI[]>;
}

export async function fetchGeocode(street: string): Promise<GeocodeResult | null> {
  const url = `${base}/map/geocode?street=${encodeURIComponent(street)}`;
  const res = await fetch(url, { headers: authHeaders(), credentials: 'include' });
  if (!res.ok) return null;
  const data: GeocodeResult | null = await res.json();
  return data;
}
