import {
  useGetAllContractsByRenterIdQuery,
  useLazyGetAllContractsByRenterIdPaginatedQuery,
} from '@/store/api/renters-api';
import { useMemo, useState } from 'react';

type TriggerArgs = {
  pageIndex: number;
  pageSize: number;
};

export const useRentersContracts = (renterId: string) => {
  const [usePagination, setUsePagination] = useState(false);

  const initialQuery = useGetAllContractsByRenterIdQuery(
    { renterId },
    { skip: !renterId || usePagination },
  );

  const [triggerRequest, paginatedQuery] = useLazyGetAllContractsByRenterIdPaginatedQuery();

  const activeQuery = usePagination ? paginatedQuery : initialQuery;
  const isFetching = activeQuery.isFetching || activeQuery.isLoading;

  const data = useMemo(() => {
    if (usePagination) {
      return paginatedQuery.data?.data ?? [];
    }

    return initialQuery.data?.allContractsByRenterId?.data ?? [];
  }, [usePagination, paginatedQuery.data, initialQuery.data]);

  const pageCount = useMemo(() => {
    if (usePagination) {
      return paginatedQuery.data?.meta?.totalPages ?? 1;
    }

    return initialQuery.data?.allContractsByRenterId?.meta?.totalPages ?? 1;
  }, [usePagination, paginatedQuery.data, initialQuery.data]);

  const trigger = ({ pageIndex, pageSize }: TriggerArgs) => {
    if (!renterId) return;

    setUsePagination(true);

    triggerRequest({
      renterId,
      page: pageIndex + 1,
      limit: pageSize,
    });
  };

  const isEmpty = data.length === 0 && !isFetching && !activeQuery.isError;

  return {
    data,
    pageCount,
    trigger,

    isLoading: isFetching,
    isError: activeQuery.isError,
    error: activeQuery.error,

    isEmpty,
  };
};
