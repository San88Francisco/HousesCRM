import { useMemo, useState } from 'react';
import { useGetHousesAnalyticsQuery, useLazyGetHousesPerformanceQuery } from '@/store/houses-api';

type TriggerArgs = {
  pageIndex: number;
  pageSize: number;
};

export const useHousesPerformance = () => {
  const [usePagination, setUsePagination] = useState(false);

  const analyticsQuery = useGetHousesAnalyticsQuery();

  const [triggerRequest, performanceQuery] = useLazyGetHousesPerformanceQuery();

  const activeQuery = usePagination ? performanceQuery : analyticsQuery;

  const data = useMemo(() => {
    if (usePagination) {
      return performanceQuery.data?.data ?? [];
    }

    return analyticsQuery.data?.housesPerformance.data ?? [];
  }, [usePagination, performanceQuery.data, analyticsQuery.data]);

  const pageCount = useMemo(() => {
    if (usePagination) {
      return performanceQuery.data?.meta?.totalPages ?? 0;
    }

    return analyticsQuery.data?.housesPerformance.meta?.totalPages ?? 1;
  }, [usePagination, performanceQuery.data, analyticsQuery.data]);

  const isEmpty = data.length === 0 && !activeQuery.isFetching && !activeQuery.isError;

  const trigger = ({ pageIndex, pageSize }: TriggerArgs) => {
    setUsePagination(true);

    triggerRequest({
      page: pageIndex + 1,
      limit: pageSize,
      sortBy: 'totalRevenue',
      order: 'DESC',
    });
  };

  return {
    data,
    trigger,
    pageCount,

    isFetching: activeQuery.isFetching,
    isError: activeQuery.isError,
    error: activeQuery.error,

    isEmpty,
  };
};
