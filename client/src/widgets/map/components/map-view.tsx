'use client';

import type { RefObject } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  type MapRef,
} from '@/components/ui/map';
import { cn } from '@/shared/utils/cn';
import { MAP_TOOLTIP_CLASS, RIVNE_CENTER } from '../constants';
import type { GeocodedHouse, GeocodeResult, InfraScope, POI } from '../types';
import { HouseTooltipContent } from './house-tooltip-content';
import { PoiMarkerDot } from './poi-marker-dot';
import { PoiTooltipBody } from './poi-tooltip-body';
import { SearchTooltipContent } from './search-tooltip-content';

type MapViewProps = {
  mapRef: RefObject<MapRef | null>;
  housesLoading: boolean;
  geocoded: GeocodedHouse[];
  infraScope: InfraScope;
  singleHouseId: string | null;
  searchResult: GeocodeResult | null;
  pois: POI[];
  poisLoading: boolean;
  onShowOnlyHouse: (house: GeocodedHouse) => void;
  onRefreshHouseInfra: (house: GeocodedHouse) => void;
  onRefreshSearchInfra: () => void;
  onGoMergedAll: () => void;
};

const POI_TOOLTIP = `${MAP_TOOLTIP_CLASS} !pointer-events-none`;

export function MapView({
  mapRef,
  housesLoading,
  geocoded,
  infraScope,
  singleHouseId,
  searchResult,
  pois,
  poisLoading,
  onShowOnlyHouse,
  onRefreshHouseInfra,
  onRefreshSearchInfra,
  onGoMergedAll,
}: MapViewProps) {
  return (
    <div className="relative min-h-[500px] flex-1 overflow-hidden rounded-xl border">
      {housesLoading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <Loader2 className="animate-spin text-muted" size={28} />
        </div>
      ) : null}

      <Map ref={mapRef} center={[RIVNE_CENTER.lng, RIVNE_CENTER.lat]} zoom={13}>
        <MapControls position="bottom-right" showZoom showCompass showFullscreen />

        {geocoded.map(house => (
          <MapMarker key={house.id} longitude={house.lng} latitude={house.lat}>
            <MarkerContent>
              <div
                className={cn(
                  'flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-110',
                  house.geocodeStatus === 'error' ? 'bg-red' : 'bg-active-bg',
                  singleHouseId === house.id &&
                    infraScope === 'single-house' &&
                    'scale-125 ring-2 ring-amber-400 ring-offset-1',
                )}
              >
                <Building2 size={10} className="text-white dark:text-dark" />
              </div>
            </MarkerContent>
            <MarkerTooltip anchor="bottom" offset={12} className={MAP_TOOLTIP_CLASS}>
              <HouseTooltipContent
                house={house}
                poisLoading={poisLoading}
                onShowOnlyHouse={onShowOnlyHouse}
                onRefreshHouseInfra={onRefreshHouseInfra}
              />
            </MarkerTooltip>
          </MapMarker>
        ))}

        {searchResult ? (
          <MapMarker longitude={searchResult.lng} latitude={searchResult.lat}>
            <MarkerContent>
              <div className="relative flex items-center justify-center">
                <div className="h-5 w-5 cursor-pointer rounded-full border-2 border-white bg-amber-500 shadow-lg transition-transform hover:scale-110" />
                <div className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-50" />
              </div>
            </MarkerContent>
            <MarkerTooltip anchor="bottom" offset={12} className={MAP_TOOLTIP_CLASS}>
              <SearchTooltipContent
                searchResult={searchResult}
                poisLoading={poisLoading}
                onRefreshSearchInfra={onRefreshSearchInfra}
                onGoMergedAll={onGoMergedAll}
              />
            </MarkerTooltip>
          </MapMarker>
        ) : null}

        {pois.map(poi => (
          <MapMarker key={poi.id} longitude={poi.lng} latitude={poi.lat}>
            <MarkerContent>
              <PoiMarkerDot category={poi.category} />
            </MarkerContent>
            <MarkerTooltip anchor="bottom" offset={12} className={POI_TOOLTIP}>
              <PoiTooltipBody poi={poi} />
            </MarkerTooltip>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
