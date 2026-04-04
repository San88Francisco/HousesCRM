'use client';

import type { RefObject } from 'react';
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  type MapRef,
} from '@/components/ui/map';
import { Button } from '@/shared/ui/button';
import { AlertCircle, Building2, Home, Layers, Loader2, RefreshCw } from 'lucide-react';
import { MAP_TOOLTIP_CLASS, RIVNE_CENTER } from '../constants';
import type { GeocodedHouse, InfraScope, POI, SearchResult } from '../types';
import { PoiMarkerDot } from './poi-marker-dot';
import { PoiTooltipBody } from './poi-tooltip-body';

type MapViewProps = {
  mapRef: RefObject<MapRef | null>;
  housesLoading: boolean;
  geocoded: GeocodedHouse[];
  infraScope: InfraScope;
  singleHouseId: string | null;
  searchResult: SearchResult | null;
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
                className={[
                  'flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-110',
                  singleHouseId === house.id && infraScope === 'single-house'
                    ? 'scale-125 ring-2 ring-amber-400 ring-offset-1'
                    : '',
                  house.geocodeStatus === 'error' ? 'bg-red' : 'bg-active-bg',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Building2 size={10} className="text-white dark:text-dark" />
              </div>
            </MarkerContent>
            <MarkerTooltip anchor="bottom" offset={12} className={MAP_TOOLTIP_CLASS}>
              <div className="min-w-[200px] max-w-[280px] space-y-2 text-left">
                <p className="text-sm font-semibold text-text">{house.apartmentName}</p>
                <p className="text-xs text-muted">{house.street}</p>
                {house.geocodeStatus === 'pending' ? (
                  <p className="flex items-center gap-1 text-xs text-muted">
                    <Loader2 size={10} className="animate-spin" /> Геокодування…
                  </p>
                ) : null}
                {house.geocodeStatus === 'error' ? (
                  <p className="flex items-center gap-1 text-xs text-red">
                    <AlertCircle size={10} /> Адресу не знайдено
                  </p>
                ) : null}
                {house.geocodeStatus === 'success' ? (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="default"
                      className="h-7 w-full text-xs"
                      disabled={poisLoading}
                      onClick={e => {
                        e.stopPropagation();
                        onShowOnlyHouse(house);
                      }}
                    >
                      <Layers size={10} className="mr-1 shrink-0" />
                      Лише ця квартира
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 w-full text-xs"
                      disabled={poisLoading}
                      onClick={e => {
                        e.stopPropagation();
                        onRefreshHouseInfra(house);
                      }}
                    >
                      <RefreshCw size={10} className="mr-1 shrink-0" />
                      Оновити дані
                    </Button>
                  </div>
                ) : null}
              </div>
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
              <div className="max-w-[260px] space-y-2 text-left">
                <p className="text-sm font-medium text-text">Результат пошуку</p>
                <p className="text-xs text-muted">{searchResult.displayName}</p>
                <div className="flex flex-col gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 w-full text-xs"
                    disabled={poisLoading}
                    onClick={e => {
                      e.stopPropagation();
                      onRefreshSearchInfra();
                    }}
                  >
                    <RefreshCw size={10} className="mr-1 shrink-0" />
                    Оновити інфраструктуру
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 w-full text-xs"
                    disabled={poisLoading}
                    onClick={e => {
                      e.stopPropagation();
                      onGoMergedAll();
                    }}
                  >
                    <Home size={10} className="mr-1 shrink-0" />
                    Усі квартири
                  </Button>
                </div>
              </div>
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
