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

        serializeQueryArgs: ({ endpointName, queryArgs }) => {
          return `${endpointName}-${queryArgs.renter_id}`;
        },

        merge: (currentCache, newData, { arg }) => {
          if (arg.page === 1) {
            return newData;
          }

          currentCache.allContractsByRenterId.data.push(...newData.allContractsByRenterId.data);
        },

        forceRefetch({ currentArg, previousArg }) {
          return currentArg?.page !== previousArg?.page;
        },

        providesTags: (_result, _error, { renter_id }) => [{ type: 'Renters', id: renter_id }],
      },
    ),
  }),
  overrideExisting: false,
});

export const { useGetAllContractsByRenterIdQuery } = rentersApi;
