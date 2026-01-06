'use client';

import type { HouseCoordinates } from '@/types/model/geo-map-3d/house-coordinates';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RefObject, useRef } from 'react';

import { Skeleton } from '@/shared/ui/skeleton';

import { cn } from '@/shared/utils/cn';
import { useMapActions } from './hooks/use-map-actions';
import { useMapInstance } from './hooks/use-map-instance';
import { useMapMarkers } from './hooks/use-map-markers';
import { useMapTheme } from './hooks/use-map-theme';
import type { MapActionsRef } from './types';

type Props = {
  houses?: HouseCoordinates[];
  actionsRef?: RefObject<MapActionsRef | null>;
};

export const GeoMap3D = ({ houses = [], actionsRef }: Props) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const highlightedHouseIdRef = useRef<string | null>(null);

  const { isDark } = useMapTheme();
  const { mapInstance, isMapLoaded, isStyleLoaded } = useMapInstance(mapContainer, isDark);

  useMapMarkers(mapInstance, houses, isDark, isMapLoaded, isStyleLoaded, highlightedHouseIdRef);

  useMapActions(mapInstance, actionsRef, isMapLoaded, highlightedHouseIdRef);

  const isMapReady = isMapLoaded && isStyleLoaded;

  return (
    <div className={cn('relative h-screen w-full overflow-hidden rounded-lg')}>
      <div
        ref={mapContainer}
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          isMapReady ? 'opacity-100' : 'opacity-0',
        )}
      />

      {!isMapReady && (
        <Skeleton
          className={cn(
            'absolute inset-0 z-10 rounded-none pointer-events-none',
            isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200',
          )}
        />
      )}
    </div>
  );
};
