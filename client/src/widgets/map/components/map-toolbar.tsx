'use client';

import { AlertCircle, Building2, Home, Layers, Loader2, Search, X } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import type { GeocodedHouse, InfraScope, POICategory, SearchResult } from '../types';
import { PoiLegend } from './poi-legend';

type MapToolbarProps = {
  geocoded: GeocodedHouse[];
  pendingCount: number;
  infraScope: InfraScope;
  infraStatusLabel: string;
  searchQuery: string;
  onSearchQueryChange: (v: string) => void;
  searchResult: SearchResult | null;
  searchError: string | null;
  isSearching: boolean;
  poisLoading: boolean;
  poisError: string | null;
  poisCount: number;
  poiCategories: POICategory[];
  onSearch: () => void;
  onClearSearch: () => void;
  onGoMergedAll: () => void;
};

export function MapToolbar({
  geocoded,
  pendingCount,
  infraScope,
  infraStatusLabel,
  searchQuery,
  onSearchQueryChange,
  searchResult,
  searchError,
  isSearching,
  poisLoading,
  poisError,
  poisCount,
  poiCategories,
  onSearch,
  onClearSearch,
  onGoMergedAll,
}: MapToolbarProps) {
  return (
    <div className="flex flex-col gap-3 px-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-text">Карта квартир — Рівне</h1>
        <div className="flex flex-wrap items-center gap-2">
          {pendingCount > 0 && (
            <Badge variant="secondary" className="gap-1 text-xs text-text">
              <Loader2 size={10} className="animate-spin" />
              Геокодування {geocoded.length - pendingCount}/{geocoded.length}
            </Badge>
          )}
          <Badge variant="outline" className="gap-1 text-xs text-text">
            <Building2 size={11} />
            {geocoded.length} квартир
          </Badge>
          <Badge
            variant="outline"
            className="max-w-[200px] gap-1 truncate text-xs text-text"
            title={infraStatusLabel}
          >
            <Layers size={11} />
            {infraStatusLabel}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Пошук вулиці або будинку в Рівному..."
            value={searchQuery}
            onChange={e => onSearchQueryChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            className="pl-8 pr-8"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>
        <Button onClick={onSearch} disabled={isSearching || !searchQuery.trim()} size="sm">
          {isSearching ? <Loader2 size={14} className="animate-spin" /> : 'Знайти'}
        </Button>
        {(infraScope !== 'merged-all' || searchResult) && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
            onClick={onGoMergedAll}
            disabled={poisLoading}
          >
            <Home size={12} />
            Усі квартири
          </Button>
        )}
      </div>

      {searchError ? (
        <p className="flex items-center gap-1.5 text-xs text-red">
          <AlertCircle size={12} /> {searchError}
        </p>
      ) : null}

      {searchResult ? (
        <p className="truncate text-xs text-muted">
          <span className="font-medium text-amber-500">●</span> {searchResult.displayName}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {poisLoading ? (
          <span className="flex items-center gap-1 text-xs text-muted">
            <Loader2 size={12} className="animate-spin" />
            Завантаження інфраструктури…
          </span>
        ) : null}
        {poisError ? <span className="text-xs text-red">{poisError}</span> : null}
      </div>

      {poisCount > 0 ? (
        <div className="rounded-md border px-3 py-2" style={{ backgroundColor: 'var(--bg-input)' }}>
          <p className="mb-1.5 text-xs font-medium text-text">
            Об&apos;єктів на карті: {poisCount}
          </p>
          <PoiLegend categories={poiCategories} />
        </div>
      ) : null}
    </div>
  );
}
