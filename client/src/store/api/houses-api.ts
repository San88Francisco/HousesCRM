import { rootApi } from '@/shared/api';
import { CurrencyRevaluation } from '@/types/core/currency-revaluation-chart';
import {
  HousesPerformanceRequest,
  HousesPerformanceResponse,
} from '@/types/core/houses-performance';
import { AllAnalyticsResponse } from '@/types/services/all-analytics';

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
  RenterByIdResponse,
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

    getRenterById: build.query<RenterByIdResponse, string>({
      query: id => `/renters/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Renters', id }],
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

    getHousesPerformance: build.query<HousesPerformanceResponse, HousesPerformanceRequest>({
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
  }),
});

export const {
  useGetHousesQuery,
  useGetHousesAnalyticsQuery,
  useLazyGetHousesAnalyticsQuery,
  useGetHouseByIdQuery,
  useGetHouseByIdOccupancyQuery,
  useGetCurrencyRevaluationQuery,
  useCreateHouseMutation,
  useUpdateHouseMutation,
  useGetRenterByIdQuery,
  useCreateRenterMutation,
  useUpdateRenterMutation,
  useGetHousesPerformanceQuery,
  useLazyGetHousesPerformanceQuery,
} = housesApi;
