import type { Map } from 'maplibre-gl';
import type { MutableRefObject } from 'react';
import { useEffect } from 'react';

import { HIGHLIGHT_ZOOM } from '../constants';
import { clearHighlight, ensureHighlightLayers, setHighlightFeature } from '../highlight-layers';
import { pickBuildingAtPoint } from '../pick-building';
import type { MapActionsRef } from '../types';

export const useMapActions = (
  mapInstance: React.RefObject<Map | null>,
  actionsRef: MutableRefObject<MapActionsRef | null> | undefined,
  isMapLoaded: boolean,
  highlightedHouseIdRef: React.MutableRefObject<string | null>,
) => {
  useEffect(() => {
    if (!actionsRef || !mapInstance.current || !isMapLoaded) return;

    actionsRef.current = {
      highlightHouse: (houseId: string, lng: number, lat: number) => {
        const map = mapInstance.current;
        if (!map) return;

        const picked = pickBuildingAtPoint(map, lng, lat);
        if (picked) {
          ensureHighlightLayers(map);
          setHighlightFeature(map, picked);
          highlightedHouseIdRef.current = houseId;
        }
      },
      highlightAndFlyToHouse: (houseId: string, lng: number, lat: number) => {
        const map = mapInstance.current;
        if (!map) return;

        map.flyTo({
          center: [lng, lat],
          zoom: HIGHLIGHT_ZOOM,
          pitch: 60,
          bearing: -20,
          duration: 2000,
          essential: true,
        });

        map.once('idle', () => {
          const picked = pickBuildingAtPoint(map, lng, lat);
          if (picked) {
            ensureHighlightLayers(map);
            setHighlightFeature(map, picked);
            highlightedHouseIdRef.current = houseId;
          } else {
            setTimeout(() => {
              const retryPicked = pickBuildingAtPoint(map, lng, lat);
              if (retryPicked) {
                ensureHighlightLayers(map);
                setHighlightFeature(map, retryPicked);
                highlightedHouseIdRef.current = houseId;
              }
            }, 1000);
          }
        });
      },
      clearHighlight: () => {
        if (mapInstance.current) {
          clearHighlight(mapInstance.current);
          highlightedHouseIdRef.current = null;
        }
      },
    };
  }, [actionsRef, isMapLoaded, mapInstance, highlightedHouseIdRef]);
};

