import {
  useGetAllContractsByRenterIdPaginatedQuery,
  useGetAllContractsByRenterIdQuery,
} from '@/store/api/renters-api';

type Props = {
  renterId: string;
  page: number | null;
  limit: number;
};

export const useRenterContractsQuery = ({ renterId, page, limit }: Props) => {
  const isInitial = page === null;

  const initial = useGetAllContractsByRenterIdQuery(
    { renterId, limit },
    { skip: !renterId || !isInitial },
  );

  const paginated = useGetAllContractsByRenterIdPaginatedQuery(
    { renterId, page: page ?? 1, limit },
    { skip: !renterId || isInitial },
  );

  if (isInitial) {
    return {
      query: initial,
      data: initial.data?.allContractsByRenterId?.data ?? [],
      meta: initial.data?.allContractsByRenterId?.meta,
    };
  }

  return {
    query: paginated,
    data: paginated.data?.data ?? [],
    meta: paginated.data?.meta,
  };
};
