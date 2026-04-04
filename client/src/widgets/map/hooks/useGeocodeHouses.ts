'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { House } from '@/types/core/house';
import { NOMINATIM_API, RIVNE_CENTER } from '../constants';
import type { GeocodedHouse, NominatimResult } from '../types';

const GEOCODE_DELAY_MS = 1100;

function buildQuery(street: string): string {
  let clean = street
    .replace(/,?\s*кв\.?\s*\d+.*$/i, '')
    .replace(/\bБОС\b/gi, '')
    .replace(/\bб\.?\s*\d+/gi, '')
    .trim();

  clean = clean.replace(/^вул\.?\s*/i, '');

  const numMatch = clean.match(/(\d+[/-]?\d*)\s*$/);
  if (numMatch) {
    const streetName = clean.substring(0, numMatch.index).trim();
    return `вулиця ${streetName} ${numMatch[1]}, Рівне, Україна`;
  }

  return `${clean}, Рівне, Україна`;
}

async function geocodeAddress(street: string): Promise<{ lat: number; lng: number } | null> {
  const query = buildQuery(street);
  const url = `${NOMINATIM_API}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=ua`;

  const response = await fetch(url, {
    headers: { 'Accept-Language': 'uk,en', 'User-Agent': 'HousesCRM/1.0' },
  });

  if (!response.ok) return null;

  const results: NominatimResult[] = await response.json();
  if (!results.length) return null;

  return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
}

export function useGeocodeHouses(houses: House[]) {
  const [geocoded, setGeocoded] = useState<GeocodedHouse[]>([]);
  const geocodeQueue = useRef<House[]>([]);
  const isProcessing = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const housesKey = useMemo(
    () =>
      houses
        .map(h => `${h.id}\0${h.street}\0${h.apartmentName}`)
        .sort()
        .join('\n'),
    [houses],
  );

  useEffect(() => {
    if (!houses.length) {
      setGeocoded([]);
      return;
    }

    const initial: GeocodedHouse[] = houses.map(h => ({
      id: h.id,
      street: h.street,
      apartmentName: h.apartmentName,
      lat: RIVNE_CENTER.lat,
      lng: RIVNE_CENTER.lng,
      geocodeStatus: 'pending',
    }));
    setGeocoded(initial);
    geocodeQueue.current = [...houses];

    if (!isProcessing.current) processQueue();
  }, [housesKey, houses]);

  async function processQueue() {
    isProcessing.current = true;
    while (geocodeQueue.current.length > 0) {
      const house = geocodeQueue.current.shift();
      if (!house) break;

      const coords = await geocodeAddress(house.street).catch(() => null);

      if (!mountedRef.current) break;

      setGeocoded(prev =>
        prev.map(g =>
          g.id === house.id
            ? {
                ...g,
                lat: coords?.lat ?? RIVNE_CENTER.lat,
                lng: coords?.lng ?? RIVNE_CENTER.lng,
                geocodeStatus: coords ? 'success' : 'error',
              }
            : g,
        ),
      );

      if (geocodeQueue.current.length > 0) {
        await new Promise(res => setTimeout(res, GEOCODE_DELAY_MS));
      }
    }
    isProcessing.current = false;
  }

  return geocoded;
}
