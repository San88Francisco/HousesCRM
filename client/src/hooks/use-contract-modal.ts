import { INTERSECTION_ROOT_MARGIN, PAGE_LIMIT } from '@/constants/renter';
import { useGetAllContractsByRenterIdQuery } from '@/store/renters-api';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useContractsModal = (
  renterId: string,
  isModalActive: boolean,
  observerResetKey: number,
) => {
  const [page, setPage] = useState<number>(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data, isFetching } = useGetAllContractsByRenterIdQuery(
    {
      renterId: renterId,
      page,
      limit: PAGE_LIMIT,
      sortBy: 'commencement',
      order: 'DESC',
    },
    {
      skip: !renterId,
    },
  );

  const contracts = data?.allContractsByRenterId.data ?? [];
  const renterInfo = data?.oneRenterReport;
  const hasMore = data?.allContractsByRenterId.meta?.hasNextPage ?? false;

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching]);

  useEffect(() => {
    if (!renterId) return;
    setPage(1);
  }, [renterId]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasMore || isFetching || !isModalActive) {
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
        rootMargin: INTERSECTION_ROOT_MARGIN,
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
  }, [hasMore, isFetching, loadMore, isModalActive, observerResetKey]);

  return {
    contracts,
    renterInfo,
    isFetching,
    hasMore,
    loadMoreRef,
  };
};
