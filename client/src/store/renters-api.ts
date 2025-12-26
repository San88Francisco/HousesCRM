import { rootApi } from '@/shared/api';
import { AllContractsByRenterIdResponse, RentersPaginatedRequest } from '@/types/services/renters';

export const rentersApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getAllContractsByRenterId: build.query<AllContractsByRenterIdResponse, RentersPaginatedRequest>(
      {
        query: ({ renter_id, sortBy, order, page, limit }) => ({
          url: `/renters/${renter_id}`,
          params: {
            page,
            limit,
            sortBy,
            order,
          },
        }),
        providesTags: (_result, _error, { renter_id }) => [{ type: 'Renters', id: renter_id }],
      },
    ),
  }),
  overrideExisting: false,
});

export const { useGetAllContractsByRenterIdQuery } = rentersApi;
