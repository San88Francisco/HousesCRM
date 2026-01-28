import { useGetAllContractsByRenterIdPaginatedQuery } from '@/store/api/renters-api';

type Props = {
  renterId: string;
  page: number;
  limit: number;
};

export const useRenterContractsQuery = ({ renterId, page, limit }: Props) => {
  const normalizedPage = Math.max(page, 1);

  const paginated = useGetAllContractsByRenterIdPaginatedQuery(
    { renterId, page: normalizedPage, limit },
    { skip: !renterId },
  );

  return {
    query: paginated,
    data: paginated.data?.data ?? [],
    meta: paginated.data?.meta,
  };
};
