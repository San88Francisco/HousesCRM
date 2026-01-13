import { AutocompleteOption } from '@/components/RHF/RHFAutocomplete';
import {
  getEntitiesFromList,
  getEntitiesFromSearch,
  getHasMorePages,
  shouldSetupObserver,
} from '@/shared/utils/create-update-contract-form/entity-autocomplete.utils';
import {
  AUTOCOMPLETE_INTERSECTION_ROOT_MARGIN,
  AUTOCOMPLETE_PAGE_LIMIT,
} from '@/store/api/paginated-api';
import { useLazyGetAllSearchQuery } from '@/store/api/search-api';
import { EntityType } from '@/types/core/autocomplete-contract-form';
import { PaginatedResponse } from '@/types/services/pagination';
import { useCallback, useEffect, useRef, useState } from 'react';

type ListQueryResult<T> = {
  data?: PaginatedResponse<T>;
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

export function useEntityAutocomplete<T>({
  entityType,
  useListQuery,
  formatOption,
}: UseEntityAutocompleteConfig<T>) {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isSearchMode = searchTerm.length > 0;

  const [triggerSearch, { data: searchData, isFetching: isSearchFetching }] =
    useLazyGetAllSearchQuery();

  const { data: listData, isFetching: isListFetching } = useListQuery(
    {
      page,
      limit: AUTOCOMPLETE_PAGE_LIMIT,
    },
    {
      skip: !isOpen || isSearchMode,
    },
  );

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

  const handleSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      setPage(1);
      if (search.length > 0) {
        triggerSearch({ query: search });
      }
    },
    [triggerSearch],
  );

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm('');
      setPage(1);
    }
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!shouldSetupObserver(target, hasMore, isFetching, isOpen, isSearchMode)) {
      observerRef.current?.disconnect();
      observerRef.current = null;
      return;
    }

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: AUTOCOMPLETE_INTERSECTION_ROOT_MARGIN,
        threshold: 0.1,
      },
    );

    if (!target) return;
    observerRef.current.observe(target);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [hasMore, isFetching, loadMore, isOpen, isSearchMode]);

  return {
    options,
    isFetching,
    hasMore,
    loadMoreRef,
    handleSearch,
    handleOpenChange,
  };
}
