import { EntityType } from '@/hooks/modals/contract-create-update-modal/use-entity-autocomplete';
import { PaginatedResponse } from '@/store/api/paginated-api';
import { SearchResponse } from '@/types/services/search';

export const getEntitiesFromSearch = <T>(
  searchData: SearchResponse | undefined,
  entityType: EntityType,
): T[] => {
  return (searchData?.[entityType] ?? []) as T[];
};

export const getEntitiesFromList = <T>(listData: PaginatedResponse<T> | undefined): T[] => {
  return listData?.data ?? [];
};

export const getHasMorePages = <T>(
  isSearchMode: boolean,
  listData: PaginatedResponse<T> | undefined,
): boolean => {
  return isSearchMode ? false : (listData?.meta?.hasNextPage ?? false);
};

export const shouldSetupObserver = (
  target: HTMLDivElement | null,
  hasMore: boolean,
  isFetching: boolean,
  isOpen: boolean,
  isSearchMode: boolean,
): boolean => {
  return !!(target && hasMore && !isFetching && isOpen && !isSearchMode);
};
