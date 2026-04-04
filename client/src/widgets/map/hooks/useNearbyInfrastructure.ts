'use client';

import { useCallback, useRef, useState } from 'react';
import type { POI } from '../types';
import {
  buildInfrastructureChunkQuery,
  buildInfrastructureQuery,
  overpassElementsToPois,
  OVERPASS_BETWEEN_CHUNK_MS,
  OVERPASS_MERGE_CHUNK,
  runOverpassQuery,
} from '../lib/overpass-poi';

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

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
      const elements = await runOverpassQuery(buildInfrastructureQuery(lat, lng));
      if (requestGen.current !== gen) return;

      const byId = new Map<number, POI>();
      for (const poi of overpassElementsToPois(elements)) {
        byId.set(poi.id, poi);
      }
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
      const globalById = new Map<number, POI>();

      for (let i = 0; i < points.length; i += OVERPASS_MERGE_CHUNK) {
        if (requestGen.current !== gen) return;
        if (i > 0) await sleep(OVERPASS_BETWEEN_CHUNK_MS);

        const chunk = points.slice(i, i + OVERPASS_MERGE_CHUNK);
        const elements = await runOverpassQuery(buildInfrastructureChunkQuery(chunk));
        for (const poi of overpassElementsToPois(elements)) {
          globalById.set(poi.id, poi);
        }
      }

      if (requestGen.current !== gen) return;
      setPois([...globalById.values()]);
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
