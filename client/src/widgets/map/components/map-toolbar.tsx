'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle, Building2, Home, Layers, Loader2, Search, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RHFForm } from '@/components/RHF/RHForm';
import { RHFInput } from '@/components/RHF/RHFInput';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { searchDefaultValues, searchSchema } from '@/shared/validation/search';
import type { SearchRequest } from '@/types/services/search';
import type { GeocodeResult, GeocodedHouse, InfraScope, POICategory } from '../types';
import { PoiLegend } from './poi-legend';

type MapToolbarProps = {
  geocoded: GeocodedHouse[];
  pendingCount: number;
  infraScope: InfraScope;
  infraStatusLabel: string;
  searchQuery: string;
  onSearchQueryChange: (v: string) => void;
  searchResult: GeocodeResult | null;
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

function useMapSearchForm(searchQuery: string, onSearchQueryChange: (v: string) => void) {
  const form = useForm<SearchRequest>({
    resolver: yupResolver(searchSchema),
    defaultValues: searchDefaultValues,
  });

  const inputValue = form.watch('query');

  useEffect(() => {
    onSearchQueryChange(inputValue ?? '');
  }, [inputValue, onSearchQueryChange]);

  useEffect(() => {
    if (!searchQuery) form.reset();
  }, [searchQuery, form]);

  return form;
}

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
  const form = useMapSearchForm(searchQuery, onSearchQueryChange);

  return (
    <div className="flex flex-col gap-3 px-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-text">Карта квартир — Рівне</h1>
        <div className="flex flex-wrap items-center gap-2">
          {pendingCount > 0 && (
            <Badge variant="secondary" className="gap-1 text-sm text-text">
              <Loader2 size={12} className="animate-spin" />
              Геокодування {geocoded.length - pendingCount}/{geocoded.length}
            </Badge>
          )}
          <Badge variant="outline" className="gap-1 text-sm text-text">
            <Building2 size={12} />
            {geocoded.length} квартир
          </Badge>
          <Badge
            variant="outline"
            className="max-w-[200px] gap-1 truncate text-sm text-text"
            title={infraStatusLabel}
          >
            <Layers size={12} />
            {infraStatusLabel}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <RHFForm form={form} onSubmit={() => onSearch()} className="">
            <RHFInput
              name="query"
              placeholder="Пошук вулиці або будинку в Рівному..."
              icon={<Search size={14} />}
            />
          </RHFForm>
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
            className="gap-1 text-sm"
            onClick={onGoMergedAll}
            disabled={poisLoading}
          >
            <Home size={14} />
            Усі квартири
          </Button>
        )}
      </div>

      {searchError ? (
        <p className="flex items-center gap-1.5 text-sm text-red">
          <AlertCircle size={14} /> {searchError}
        </p>
      ) : null}

      {searchResult ? (
        <p className="truncate text-sm text-muted">
          <span className="font-medium text-amber-500">●</span> {searchResult.displayName}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {poisLoading ? (
          <span className="flex items-center gap-1 text-sm text-muted">
            <Loader2 size={14} className="animate-spin" />
            Завантаження інфраструктури…
          </span>
        ) : null}
        {poisError ? <span className="text-sm text-red">{poisError}</span> : null}
      </div>

      {poisCount > 0 ? (
        <div className="rounded-md border bg-bg-input px-3 py-2">
          <p className="mb-1.5 text-sm font-medium text-text">
            Об&apos;єктів на карті: {poisCount}
          </p>
          <PoiLegend categories={poiCategories} />
        </div>
      ) : null}
    </div>
  );
}
