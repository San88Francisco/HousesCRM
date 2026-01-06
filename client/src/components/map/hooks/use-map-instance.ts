import type { Map } from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';

import { createMapStyle, initializeMap } from '../map-setup';

type MapState = {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
};

export const useMapInstance = (
  mapContainer: React.RefObject<HTMLDivElement | null>,
  isDark: boolean,
) => {
  const mapInstance = useRef<Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const mapStateRef = useRef<MapState | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapInstance.current) {
      const { map, cleanup } = initializeMap(mapContainer.current, isDark);
      mapInstance.current = map;

      map.on('load', () => {
        setIsMapLoaded(true);
        setIsStyleLoaded(true);
        if (mapStateRef.current) {
          map.setCenter(mapStateRef.current.center);
          map.setZoom(mapStateRef.current.zoom);
          map.setPitch(mapStateRef.current.pitch);
          map.setBearing(mapStateRef.current.bearing);
        }
      });

      return () => {
        if (mapInstance.current) {
          mapStateRef.current = {
            center: mapInstance.current.getCenter().toArray() as [number, number],
            zoom: mapInstance.current.getZoom(),
            pitch: mapInstance.current.getPitch(),
            bearing: mapInstance.current.getBearing(),
          };
        }
        cleanup();
        mapInstance.current = null;
      };
    } else {
      const map = mapInstance.current;
      const savedState: MapState = {
        center: map.getCenter().toArray() as [number, number],
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      };

      setIsStyleLoaded(false);

      const newStyle = createMapStyle(isDark);

      map.once('styledata', () => {
        map.jumpTo({
          center: savedState.center,
          zoom: savedState.zoom,
          pitch: savedState.pitch,
          bearing: savedState.bearing,
        });
        setIsStyleLoaded(true);
      });

      map.setStyle(newStyle);
    }
  }, [isDark, mapContainer]);

  return {
    mapInstance,
    isMapLoaded,
    isStyleLoaded,
  };
};

