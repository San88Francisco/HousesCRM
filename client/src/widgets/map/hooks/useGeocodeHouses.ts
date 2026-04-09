'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { House } from '@/types/core/house';
import { RIVNE_CENTER } from '../constants';
import type { GeocodedHouse } from '../types';
import { fetchGeocode } from '../lib/map-api-client';

const GEOCODE_DELAY_MS = 400;

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

      const result = await fetchGeocode(house.street).catch(() => null);

      if (!mountedRef.current) break;

      setGeocoded(prev =>
        prev.map(g =>
          g.id === house.id
            ? {
                ...g,
                lat: result?.lat ?? RIVNE_CENTER.lat,
                lng: result?.lng ?? RIVNE_CENTER.lng,
                geocodeStatus: result ? 'success' : 'error',
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
