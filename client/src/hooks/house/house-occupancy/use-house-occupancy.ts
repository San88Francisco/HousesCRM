import { useGetHouseByIdQuery, useLazyGetHouseByIdOccupancyQuery } from '@/store/api/houses-api';
import { useMemo, useState } from 'react';

type TriggerArgs = {
  pageIndex: number;
  pageSize: number;
};

export const useHouseOccupancy = (houseId?: string) => {
  const [usePagination, setUsePagination] = useState(false);

  const initialQuery = useGetHouseByIdQuery(houseId ?? '', {
    skip: !houseId || usePagination,
  });

  const [triggerRequest, occupancyQuery] = useLazyGetHouseByIdOccupancyQuery();

  const activeQuery = usePagination ? occupancyQuery : initialQuery;

  const data = useMemo(() => {
    if (usePagination) {
      return occupancyQuery.data?.data ?? [];
    }

    return initialQuery.data?.occupancyReports?.data ?? [];
  }, [usePagination, occupancyQuery.data, initialQuery.data]);

  const pageCount = useMemo(() => {
    if (usePagination) {
      return occupancyQuery.data?.meta?.totalPages ?? 1;
    }

    return initialQuery.data?.occupancyReports?.meta?.totalPages ?? 1;
  }, [usePagination, occupancyQuery.data, initialQuery.data]);

  const trigger = ({ pageIndex, pageSize }: TriggerArgs) => {
    if (!houseId) return;

    setUsePagination(true);

    triggerRequest({
      id: houseId,
      page: pageIndex + 1,
      limit: pageSize,
    });
  };

  const isEmpty = data.length === 0 && !activeQuery.isFetching && !activeQuery.isError;

  return {
    data,
    pageCount,
    trigger,

    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    error: activeQuery.error,

    isEmpty,
  };
};
