import { rootApi } from '@/shared/api';
import { RentersOccupancyRequest, RentersOccupancyResponse } from '@/types/core/renters-occupancy';
import { AllContractsByRenterIdResponse, RentersPaginatedRequest } from '@/types/services/renters';

export const rentersApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getAllContractsByRenterId: build.query<AllContractsByRenterIdResponse, RentersPaginatedRequest>(
      {
        query: ({ renterId, sortBy, order, page, limit }) => ({
          url: `/renters/${renterId}`,
          params: {
            page,
            limit,
            sortBy,
            order,
          },
        }),

        serializeQueryArgs: ({ endpointName, queryArgs }) => {
          return `${endpointName}-${queryArgs.renterId}`;
        },

        merge: (currentCache, newData, { arg }) => {
          if (arg.page === 1) {
            return newData;
          }

          currentCache.allContractsByRenterId.data.push(...newData.allContractsByRenterId.data);
          currentCache.allContractsByRenterId.meta = newData.allContractsByRenterId.meta;
          currentCache.oneRenterReport = newData.oneRenterReport;
        },

        forceRefetch({ currentArg, previousArg }) {
          return currentArg?.page !== previousArg?.page;
        },

        providesTags: (_result, _error, { renterId }) => [{ type: 'Renters', id: renterId }],
      },
    ),
    getRenters: build.query<RentersOccupancyResponse, RentersOccupancyRequest>({
      query: ({ page, limit, sortBy, order }) => ({
        url: '/renters',
        method: 'GET',
        params: {
          page,
          limit,
          sortBy,
          order,
        },
      }),
      providesTags: ['Renters'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllContractsByRenterIdQuery, useGetRentersQuery } = rentersApi;
