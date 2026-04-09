'use client';

import { AlertCircle, Layers, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { GeocodedHouse } from '../types';

type Props = {
  house: GeocodedHouse;
  poisLoading: boolean;
  onShowOnlyHouse: (house: GeocodedHouse) => void;
  onRefreshHouseInfra: (house: GeocodedHouse) => void;
};

export function HouseTooltipContent({
  house,
  poisLoading,
  onShowOnlyHouse,
  onRefreshHouseInfra,
}: Props) {
  return (
    <div className="min-w-[200px] max-w-[280px] space-y-2 text-left">
      <p className="text-sm font-semibold text-text">{house.apartmentName}</p>
      <p className="text-sm text-muted">{house.street}</p>
      {house.geocodeStatus === 'pending' && (
        <p className="flex items-center gap-1 text-sm text-muted">
          <Loader2 size={12} className="animate-spin" /> Геокодування…
        </p>
      )}
      {house.geocodeStatus === 'error' && (
        <p className="flex items-center gap-1 text-sm text-red">
          <AlertCircle size={12} /> Адресу не знайдено
        </p>
      )}
      {house.geocodeStatus === 'success' && (
        <div className="flex flex-col gap-1.5 pt-1">
          <Button
            type="button"
            size="sm"
            variant="default"
            className="h-8 w-full text-sm"
            disabled={poisLoading}
            onClick={e => {
              e.stopPropagation();
              onShowOnlyHouse(house);
            }}
          >
            <Layers size={12} className="mr-1 shrink-0" />
            Лише ця квартира
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 w-full text-sm"
            disabled={poisLoading}
            onClick={e => {
              e.stopPropagation();
              onRefreshHouseInfra(house);
            }}
          >
            <RefreshCw size={12} className="mr-1 shrink-0" />
            Оновити дані
          </Button>
        </div>
      )}
    </div>
  );
}
