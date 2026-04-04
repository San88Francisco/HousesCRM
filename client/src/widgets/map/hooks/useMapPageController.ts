'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MapRef } from '@/components/ui/map';
import { useGetHousesQuery } from '@/store/api/houses-api';
import type { GeocodedHouse, InfraScope, SearchResult } from '../types';
import { geocodeStreetRivne } from '../lib/nominatim-rivne';
import { geocodedSuccessPoints } from '../utils/success-coords';
import { useGeocodeHouses } from './useGeocodeHouses';
import { useNearbyInfrastructure } from './useNearbyInfrastructure';

export function useMapPageController() {
  const mapRef = useRef<MapRef>(null);
  const { data, isLoading: housesLoading } = useGetHousesQuery();
  const houses = data?.data ?? [];
  const geocoded = useGeocodeHouses(houses);

  const {
    pois,
    isLoading: poisLoading,
    error: poisError,
    fetch500m,
    fetchMerged500m,
    clear: clearPois,
  } = useNearbyInfrastructure();

  const [infraScope, setInfraScope] = useState<InfraScope>('merged-all');
  const [singleHouseId, setSingleHouseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const pendingCount = useMemo(
    () => geocoded.filter(g => g.geocodeStatus === 'pending').length,
    [geocoded],
  );
  const okCoords = useMemo(() => geocodedSuccessPoints(geocoded), [geocoded]);

  useEffect(() => {
    if (infraScope !== 'merged-all' || searchResult) return;
    if (okCoords.length === 0) {
      clearPois();
      return;
    }
    const delay = pendingCount > 0 ? 900 : 300;
    const t = window.setTimeout(() => {
      void fetchMerged500m(okCoords);
    }, delay);
    return () => window.clearTimeout(t);
  }, [geocoded, infraScope, searchResult, pendingCount, okCoords, fetchMerged500m, clearPois]);

  const goMergedAll = useCallback(() => {
    setInfraScope('merged-all');
    setSingleHouseId(null);
    setSearchResult(null);
    setSearchQuery('');
    setSearchError(null);
  }, []);

  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);
    setSingleHouseId(null);

    try {
      const found = await geocodeStreetRivne(q);
      if (!found) {
        setSearchError('Адресу не знайдено');
        return;
      }
      setSearchResult(found);
      setInfraScope('search');
      mapRef.current?.flyTo({ center: [found.lng, found.lat], zoom: 16 });
      await fetch500m(found.lat, found.lng);
    } catch {
      setSearchError('Помилка пошуку');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, fetch500m]);

  const showOnlyThisHouse = useCallback(
    (house: GeocodedHouse) => {
      if (house.geocodeStatus !== 'success') return;
      setSearchResult(null);
      setSearchQuery('');
      setSearchError(null);
      setInfraScope('single-house');
      setSingleHouseId(house.id);
      mapRef.current?.flyTo({ center: [house.lng, house.lat], zoom: 16 });
      void fetch500m(house.lat, house.lng);
    },
    [fetch500m],
  );

  const refreshInfraForHouse = useCallback(
    (house: GeocodedHouse) => {
      if (house.geocodeStatus !== 'success') return;
      if (infraScope === 'merged-all') {
        void fetchMerged500m(okCoords);
        return;
      }
      setInfraScope('single-house');
      setSingleHouseId(house.id);
      void fetch500m(house.lat, house.lng);
    },
    [infraScope, okCoords, fetchMerged500m, fetch500m],
  );

  const refreshSearchInfra = useCallback(() => {
    if (!searchResult) return;
    void fetch500m(searchResult.lat, searchResult.lng);
  }, [searchResult, fetch500m]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResult(null);
    setSearchError(null);
    setInfraScope('merged-all');
    setSingleHouseId(null);
  }, []);

  const infraStatusLabel = useMemo(() => {
    if (infraScope === 'search' && searchResult) return 'Пошук';
    if (infraScope === 'single-house' && singleHouseId) {
      return geocoded.find(g => g.id === singleHouseId)?.apartmentName ?? 'Одна квартира';
    }
    return 'Усі квартири';
  }, [infraScope, searchResult, singleHouseId, geocoded]);

  const poiCategories = useMemo(() => pois.map(p => p.category), [pois]);

  return {
    mapRef,
    geocoded,
    housesLoading,
    pendingCount,
    pois,
    poisLoading,
    poisError,
    infraScope,
    singleHouseId,
    searchQuery,
    setSearchQuery,
    searchResult,
    searchError,
    isSearching,
    infraStatusLabel,
    poiCategories,
    goMergedAll,
    handleSearch,
    clearSearch,
    showOnlyThisHouse,
    refreshInfraForHouse,
    refreshSearchInfra,
  };
}
