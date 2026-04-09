'use client';

import { useCallback, useRef, useState } from 'react';
import type { POI } from '../types';
import { fetchPoi, fetchPoiBulk } from '../lib/map-api-client';

export function useNearbyInfrastructure() {
  const [pois, setPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestGen = useRef(0);

  const fetch500m = useCallback(async (lat: number, lng: number) => {
    const gen = ++requestGen.current;
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPoi(lat, lng);
      if (requestGen.current !== gen) return;

      const byId = new Map<number, POI>();
      for (const poi of data) byId.set(poi.id, poi);
      setPois([...byId.values()]);
    } catch (err) {
      if (requestGen.current !== gen) return;
      setError(err instanceof Error ? err.message : 'Помилка завантаження');
      setPois([]);
    } finally {
      if (requestGen.current === gen) setIsLoading(false);
    }
  }, []);

  const fetchMerged500m = useCallback(async (points: { lat: number; lng: number }[]) => {
    const gen = ++requestGen.current;
    if (points.length === 0) {
      setPois([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPoiBulk(points);
      if (requestGen.current !== gen) return;

      const byId = new Map<number, POI>();
      for (const poi of data) byId.set(poi.id, poi);
      setPois([...byId.values()]);
    } catch (err) {
      if (requestGen.current !== gen) return;
      setError(err instanceof Error ? err.message : 'Помилка завантаження');
      setPois([]);
    } finally {
      if (requestGen.current === gen) setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    requestGen.current += 1;
    setPois([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return { pois, isLoading, error, fetch500m, fetchMerged500m, clear };
}
