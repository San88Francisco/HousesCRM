import { EntityType } from '@/types/core/autocomplete-contract-form';
import { LazyLoadingAutocomplete } from '@/types/services/lazy-loading-autocomplete';
import { SearchResponse } from '@/types/services/search';

export const getEntitiesFromSearch = <T>(
  searchData: SearchResponse | undefined,
  entityType: EntityType,
): T[] => {
  return (searchData?.[entityType] ?? []) as T[];
};

export const getEntitiesFromList = <T>(listData: LazyLoadingAutocomplete<T> | undefined): T[] => {
  return listData?.data ?? [];
};

export const getHasMorePages = <T>(
  isSearchMode: boolean,
  listData: LazyLoadingAutocomplete<T> | undefined,
): boolean => {
  return isSearchMode ? false : (listData?.meta?.hasNextPage ?? false);
};
