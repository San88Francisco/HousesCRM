import { AutocompleteOption } from '@/components/RHF/RHFAutocomplete';
import {
  getEntitiesFromList,
  getEntitiesFromSearch,
  getHasMorePages,
} from '@/shared/utils/create-update-contract-form/entity-autocomplete.utils';
import { useLazyGetAllSearchQuery } from '@/store/api/search-api';
import { EntityType } from '@/types/core/autocomplete-contract-form';
import { LazyLoadingAutocomplete } from '@/types/services/lazy-loading-autocomplete';
import { useCallback, useEffect, useRef, useState } from 'react';

const SEARCH_DEBOUNCE = 500;
const PAGE_LIMIT = 10;
const INTERSECTION_ROOT_MARGIN = '50px';

type ListQueryResult<T> = {
  data?: LazyLoadingAutocomplete<T>;
  isFetching: boolean;
};

type Props<T> = {
  entityType: EntityType;
  useListQuery: (
    args: { page: number; limit: number },
    options: { skip: boolean; refetchOnMountOrArgChange?: boolean | number },
  ) => ListQueryResult<T>;
  formatOption: (item: T) => AutocompleteOption;
  initialEntity?: T | null;
};

export const useEntityAutocomplete = <T extends { id: string }>({
  entityType,
  useListQuery,
  formatOption,
  initialEntity,
}: Props<T>) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState({ term: '', debounced: '' });
  const [isOpen, setIsOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isSearchMode = search.debounced.length > 0;

  useEffect(() => {
    if (search.term.length < 2) {
      setSearch(prev => ({ ...prev, debounced: '' }));
      setPage(1);
      return;
    }

    const timeoutId = setTimeout(() => {
      setSearch(prev => ({ ...prev, debounced: prev.term }));
      setPage(1);
    }, SEARCH_DEBOUNCE);

    return () => clearTimeout(timeoutId);
  }, [search.term]);

  const [triggerSearch, { data: searchData, isFetching: isSearchFetching }] =
    useLazyGetAllSearchQuery();

  // RTK Query автоматично кешує запити через keepUnusedDataFor (5 хвилин)
  // Використовуємо refetchOnMountOrArgChange: true, щоб завжди робити запити при зміні аргументів
  // Це забезпечує lazy loading для нових сторінок
  // Кешування працює через keepUnusedDataFor в endpoint
  const { data: listData, isFetching: isListFetching } = useListQuery(
    { page, limit: PAGE_LIMIT },
    {
      skip: !isOpen || isSearchMode,
      // Завжди робимо запит при зміні аргументів (page змінюється для lazy loading)
      // RTK Query автоматично використає кеш якщо він актуальний через keepUnusedDataFor
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (search.debounced) {
      triggerSearch({ query: search.debounced });
    }
  }, [search.debounced, triggerSearch]);

  const entities = isSearchMode
    ? getEntitiesFromSearch<T>(searchData, entityType)
    : getEntitiesFromList<T>(listData);

  const allEntities = initialEntity
    ? [initialEntity, ...entities.filter(entity => entity.id !== initialEntity.id)]
    : entities;

  const hasMore = getHasMorePages(isSearchMode, listData);
  const isFetching = isSearchMode ? isSearchFetching : isListFetching;
  const options: AutocompleteOption[] = allEntities.map(formatOption);

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching && !isSearchMode) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching, isSearchMode]);

  const handleSearch = useCallback((term: string) => {
    setSearch(prev => ({ ...prev, term }));
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    setPage(1);

    if (!open) {
      setSearch({ term: '', debounced: '' });
    }
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore || isFetching || !isOpen || isSearchMode) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: INTERSECTION_ROOT_MARGIN, threshold: 0.1 },
    );

    observer.observe(target);

    return () => observer.disconnect();
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
