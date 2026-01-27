import { useMemo, useState } from 'react';
import { useRenterContractsQuery } from './use-renter-contracts-query';

type TriggerArgs = {
  pageIndex: number;
  pageSize: number;
};

export const useRentersContracts = (renterId: string) => {
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [limit, setLimit] = useState(10);

  const { query, data, meta } = useRenterContractsQuery({
    renterId,
    page: currentPage,
    limit,
  });

  const pageCount = useMemo(() => {
    return meta?.totalPages ?? 1;
  }, [meta]);

  const trigger = ({ pageIndex, pageSize }: TriggerArgs) => {
    if (!renterId) return;

    setLimit(pageSize);
    setCurrentPage(pageIndex > 0 ? pageIndex + 1 : null);
  };

  const isEmpty = data.length === 0 && !query.isFetching && !query.isError;

  return {
    data,
    pageCount,
    trigger,

    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    isEmpty,
  };
};
