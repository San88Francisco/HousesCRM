/* eslint-disable */

import { AutocompleteOption } from '@/components/RHF/RHFAutocomplete';
import {
  AUTOCOMPLETE_INTERSECTION_ROOT_MARGIN,
  AUTOCOMPLETE_PAGE_LIMIT,
  useGetAllHousesQuery,
} from '@/store/api/house-renter-api';
import { useLazyGetAllSearchQuery } from '@/store/api/search-api';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useHousesAutocomplete = () => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Lazy query для пошуку
  const [triggerSearch, { data: searchData, isFetching: isSearchFetching }] =
    useLazyGetAllSearchQuery();

  // Звичайний query для списку без пошуку (з пагінацією)
  const { data: listData, isFetching: isListFetching } = useGetAllHousesQuery(
    {
      page,
      limit: AUTOCOMPLETE_PAGE_LIMIT,
      sortBy: 'totalRevenue',
      order: 'DESC',
    },
    {
      skip: !isOpen || searchTerm.length > 0, // Skip якщо є пошук
    },
  );

  // Визначаємо які дані використовувати
  const isSearchMode = searchTerm.length > 0;
  const houses = isSearchMode ? (searchData?.houses ?? []) : (listData?.data ?? []);
  const hasMore = isSearchMode ? false : (listData?.meta?.hasNextPage ?? false);
  const isFetching = isSearchMode ? isSearchFetching : isListFetching;

  const options: AutocompleteOption[] = houses.map(house => ({
    value: house.id,
    label: `${house.apartmentName} - ${house.street}`,
    disabled: false,
  }));

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching && !isSearchMode) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching, isSearchMode]);

  const handleSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      if (search.length > 0) {
        // Викликаємо search API
        triggerSearch({ query: search });
        setPage(1); // Скидаємо пагінацію при пошуку
      } else {
        // Повертаємось до звичайного списку
        setPage(1);
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

  // Intersection Observer для інфінітного скролу (тільки для списку без пошуку)
  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasMore || isFetching || !isOpen || isSearchMode) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

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

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
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
};
