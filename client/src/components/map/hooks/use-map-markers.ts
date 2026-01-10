import type { HouseCoordinates } from '@/types/model/geo-map-3d/house-coordinates';
import type { Map, Marker } from 'maplibre-gl';
import { RefObject, useEffect, useRef } from 'react';

import { createHouseMarkers } from '../map-markers';

export const useMapMarkers = (
  mapInstance: RefObject<Map | null>,
  houses: HouseCoordinates[],
  isDark: boolean,
  isMapLoaded: boolean,
  isStyleLoaded: boolean,
  highlightedHouseIdRef: RefObject<string | null>,
) => {
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!mapInstance.current || !isMapLoaded || !isStyleLoaded || !houses.length) return;

    const housesWithValidCoords = houses.filter(house => house.lng !== 0 || house.lat !== 0);

    markersRef.current.forEach(m => m.remove());

    const mapContainer = mapInstance.current.getContainer();
    const oldTooltips = mapContainer.querySelectorAll('[data-house-id]');
    oldTooltips.forEach(tooltip => tooltip.remove());

    markersRef.current = createHouseMarkers(
      mapInstance.current,
      housesWithValidCoords,
      isDark,
      highlightedHouseIdRef,
    );

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      if (mapInstance.current) {
        const mapContainer = mapInstance.current.getContainer();
        const oldTooltips = mapContainer.querySelectorAll('[data-house-id]');
        oldTooltips.forEach(tooltip => tooltip.remove());
      }
    };
  }, [houses, isMapLoaded, isStyleLoaded, isDark, mapInstance, highlightedHouseIdRef]);

  return markersRef;
};
