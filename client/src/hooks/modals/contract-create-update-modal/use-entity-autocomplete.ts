import { AutocompleteOption } from '@/components/RHF/RHFAutocomplete';
import {
  getEntitiesFromList,
  getEntitiesFromSearch,
  getHasMorePages,
  shouldSetupObserver,
} from '@/shared/utils/create-update-contract-form/entity-autocomplete.utils';
import { useLazyGetAllSearchQuery } from '@/store/api/search-api';
import { EntityType } from '@/types/core/autocomplete-contract-form';
import { LazyLoadingAutocomplete } from '@/types/services/lazy-loading-autocomplete';
import { useCallback, useEffect, useRef, useState } from 'react';

export const AUTOCOMPLETE_SEARCH_DEBOUNCE = 500;
export const AUTOCOMPLETE_PAGE_LIMIT = 10;
export const AUTOCOMPLETE_INTERSECTION_ROOT_MARGIN = '100px';

type ListQueryResult<T> = {
  data?: LazyLoadingAutocomplete<T>;
  isFetching: boolean;
};

type UseEntityAutocompleteConfig<T> = {
  entityType: EntityType;
  useListQuery: (
    args: { page: number; limit: number },
    options: { skip: boolean },
  ) => ListQueryResult<T>;
  formatOption: (item: T) => AutocompleteOption;
};

export const useEntityAutocomplete = <T>({
  entityType,
  useListQuery,
  formatOption,
}: UseEntityAutocompleteConfig<T>) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isSearchMode = debouncedSearch.length > 0;

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const timeoutId = setTimeout(() => {
        setDebouncedSearch(searchTerm);
        setPage(1);
      }, AUTOCOMPLETE_SEARCH_DEBOUNCE);
      return () => clearTimeout(timeoutId);
    } else if (searchTerm.length === 0) {
      setDebouncedSearch('');
      setPage(1);
    }
  }, [searchTerm]);

  const [triggerSearch, { data: searchData, isFetching: isSearchFetching }] =
    useLazyGetAllSearchQuery();

  const { data: listData, isFetching: isListFetching } = useListQuery(
    { page, limit: AUTOCOMPLETE_PAGE_LIMIT },
    { skip: !isOpen || isSearchMode },
  );

  useEffect(() => {
    if (debouncedSearch) {
      triggerSearch({ query: debouncedSearch });
    }
  }, [debouncedSearch, triggerSearch]);

  const entities = isSearchMode
    ? getEntitiesFromSearch<T>(searchData, entityType)
    : getEntitiesFromList<T>(listData);

  const hasMore = getHasMorePages(isSearchMode, listData);
  const isFetching = isSearchMode ? isSearchFetching : isListFetching;
  const options: AutocompleteOption[] = entities.map(formatOption);

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching && !isSearchMode) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching, isSearchMode]);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm('');
      setDebouncedSearch('');
      setPage(1);
    }
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!shouldSetupObserver(target, hasMore, isFetching, isOpen, isSearchMode)) {
      observerRef.current?.disconnect();
      return;
    }

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: AUTOCOMPLETE_INTERSECTION_ROOT_MARGIN, threshold: 0.1 },
    );

    if (target) observerRef.current.observe(target);

    return () => observerRef.current?.disconnect();
  }, [hasMore, isFetching, loadMore, isOpen, isSearchMode]);

  return {
    options,
    isFetching,
    hasMore,
    loadMoreRef,
    handleSearch,
    handleOpenChange,
  };
};
