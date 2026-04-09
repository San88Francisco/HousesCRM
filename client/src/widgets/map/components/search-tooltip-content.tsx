'use client';

import { Home, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { GeocodeResult } from '../types';

type Props = {
  searchResult: GeocodeResult;
  poisLoading: boolean;
  onRefreshSearchInfra: () => void;
  onGoMergedAll: () => void;
};

export function SearchTooltipContent({
  searchResult,
  poisLoading,
  onRefreshSearchInfra,
  onGoMergedAll,
}: Props) {
  return (
    <div className="max-w-[260px] space-y-2 text-left">
      <p className="text-sm font-medium text-text">Результат пошуку</p>
      <p className="text-sm text-muted">{searchResult.displayName}</p>
      <div className="flex flex-col gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 w-full text-sm"
          disabled={poisLoading}
          onClick={e => {
            e.stopPropagation();
            onRefreshSearchInfra();
          }}
        >
          <RefreshCw size={12} className="mr-1 shrink-0" />
          Оновити інфраструктуру
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-8 w-full text-sm"
          disabled={poisLoading}
          onClick={e => {
            e.stopPropagation();
            onGoMergedAll();
          }}
        >
          <Home size={12} className="mr-1 shrink-0" />
          Усі квартири
        </Button>
      </div>
    </div>
  );
}
