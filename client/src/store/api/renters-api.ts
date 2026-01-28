import { rootApi } from '@/shared/api';
import { RentersOccupancyRequest, RentersOccupancyResponse } from '@/types/core/renters-occupancy';
import {
  AllContractsByRenterIdResponse,
  RentersIdContractsResponse,
  RentersPaginatedRequest,
} from '@/types/services/renters';

export const rentersApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getAllContractsByRenterIdMerge: build.query<
      AllContractsByRenterIdResponse,
      RentersPaginatedRequest
    >({
      query: ({ renterId, sortBy, order, page, limit }) => ({
        url: `/renters/${renterId}`,
        params: {
          page,
          limit,
          sortBy,
          order,
        },
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.renterId}-${queryArgs.limit ?? 'default'}-${queryArgs.sortBy ?? 'default'}-${queryArgs.order ?? 'default'}`,

      merge: (currentCache, newData, { arg }) => {
        if (arg.page === 1) {
          return newData;
        }

        currentCache.allContractsByRenterId.data.push(...newData.allContractsByRenterId.data);
        currentCache.allContractsByRenterId.meta = newData.allContractsByRenterId.meta;
        currentCache.oneRenterReport = newData.oneRenterReport;
      },

      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.limit !== previousArg?.limit ||
          currentArg?.sortBy !== previousArg?.sortBy ||
          currentArg?.order !== previousArg?.order
        );
      },

      providesTags: (_r, _e, { renterId }) => [{ type: 'Renters', id: renterId }],
    }),

    getAllContractsByRenterId: build.query<
      AllContractsByRenterIdResponse,
      { renterId: string; limit?: number }
    >({
      query: ({ renterId, limit }) => ({
        url: `/renters/${renterId}`,
        params: { limit },
      }),

      providesTags: (_r, _e, { renterId }) => [{ type: 'Renters', id: renterId }],
    }),
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
    getAllContractsByRenterIdPaginated: build.query<
      RentersIdContractsResponse,
      RentersPaginatedRequest
    >({
      query: ({ renterId, page, limit }) => ({
        url: `/renters/${renterId}/contracts`,
        params: {
          page,
          limit,
        },
      }),

      providesTags: (_r, _e, { renterId }) => [{ type: 'Renters', id: renterId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllContractsByRenterIdMergeQuery,
  useGetAllContractsByRenterIdQuery,
  useGetAllContractsByRenterIdPaginatedQuery,
  useGetRentersQuery,
} = rentersApi;
