import { rootApi } from '@/shared/api';
import { CurrencyRevaluation } from '@/types/core/currency-revaluation-chart';
import { HousesPerformanceResponse } from '@/types/core/houses-performance';
import { PaginationRequest } from '@/types/core/pagination';
import { AllAnalyticsResponse } from '@/types/services/all-analytics';
import {
  ContractByIdResponse,
  CreateContractRequest,
  CreateContractResponse,
  UpdateContractRequest,
  UpdateContractResponse,
} from '@/types/services/contracts';

import {
  CreateHouseRequest,
  CreateHouseResponse,
  HouseByIdResponse,
  HousesResponse,
  OccupancyHousesPaginatedResponse,
  OccupancyHousesRequest,
  UpdateHouseRequest,
  UpdateHouseResponse,
} from '@/types/services/houses/index';
import {
  CreateRenterRequest,
  CreateRenterResponse,
  UpdateRenterRequest,
  UpdateRenterResponse,
} from '@/types/services/renters';

export const housesApi = rootApi.injectEndpoints({
  overrideExisting: false,
  endpoints: build => ({
    getHouses: build.query<HousesResponse, void>({
      query: () => '/houses',
      providesTags: ['Analytics'],
    }),
    getHousesAnalytics: build.query<AllAnalyticsResponse, void>({
      query: () => '/houses-analytics/all-analytics',
      providesTags: ['Analytics'],
    }),

    getHouseById: build.query<HouseByIdResponse, string>({
      query: id => `/houses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Houses', id }],
    }),

    getHouseByIdOccupancy: build.query<OccupancyHousesPaginatedResponse, OccupancyHousesRequest>({
      query: ({ id, page = 1, limit = 10 }) => ({
        url: `/houses/${id}/occupancy`,
        params: { page, limit },
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'Houses', id }],
    }),

    getCurrencyRevaluation: build.query<CurrencyRevaluation[], void>({
      query: () => '/houses-analytics/currency-revaluation-analytic',
      providesTags: ['Analytics'],
    }),

    createHouse: build.mutation<CreateHouseResponse, CreateHouseRequest>({
      query: body => ({
        url: '/houses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Houses', 'Analytics'],
    }),

    updateHouse: build.mutation<UpdateHouseResponse, UpdateHouseRequest>({
      query: ({ id, ...body }) => ({
        url: `/houses/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Houses', id }, 'Analytics'],
    }),

    createRenter: build.mutation<CreateRenterResponse, CreateRenterRequest>({
      query: body => ({
        url: '/renters',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Renters', 'Analytics'],
    }),

    updateRenter: build.mutation<UpdateRenterResponse, UpdateRenterRequest>({
      query: ({ id, ...body }) => ({
        url: `/renters/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Renters', id }, 'Analytics'],
    }),

    getHousesPerformance: build.query<HousesPerformanceResponse, PaginationRequest>({
      query: ({ page, limit, sortBy, order }) => ({
        url: '/houses-analytics/houses-performance-analytic',
        params: {
          page,
          limit,
          sortBy,
          order,
        },
      }),
      providesTags: ['Houses'],
    }),

    createContract: build.mutation<CreateContractResponse, CreateContractRequest>({
      query: body => ({
        url: '/contracts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Contracts', 'Analytics', 'Houses', 'Renters'],
    }),

    updateContract: build.mutation<UpdateContractResponse, UpdateContractRequest>({
      query: ({ id, ...body }) => ({
        url: `/contracts/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Contracts', id },
        'Analytics',
        'Houses',
        'Renters',
      ],
    }),

    getContractById: build.query<ContractByIdResponse, string>({
      query: id => `/contracts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Contracts', id }],
    }),

    deleteHouse: build.mutation<void, string>({
      query: id => ({
        url: `/houses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Analytics', 'Houses', 'Contracts', 'Renters'],
    }),
  }),
});

export const {
  useGetHousesQuery,
  useGetHousesAnalyticsQuery,
  useLazyGetHousesAnalyticsQuery,
  useGetHouseByIdQuery,
  useGetHouseByIdOccupancyQuery,
  useLazyGetHouseByIdOccupancyQuery,
  useGetCurrencyRevaluationQuery,
  useCreateHouseMutation,
  useUpdateHouseMutation,
  useCreateRenterMutation,
  useUpdateRenterMutation,
  useGetHousesPerformanceQuery,
  useLazyGetHousesPerformanceQuery,
  useCreateContractMutation,
  useUpdateContractMutation,
  useGetContractByIdQuery,
  useDeleteHouseMutation,
} = housesApi;
