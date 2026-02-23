import { rootApi } from '@/shared/api';
import { AllAnalyticsResponse } from '@/types/services/all-analytics';
import { PaginationRequest } from '@/types/services/pagination';

import {
  CreateHouseRequest,
  CreateHouseResponse,
  CurrencyRevaluationResponse,
  HouseByIdResponse,
  HousesPerformanceResponse,
  HousesResponse,
  OccupancyHousesPaginatedResponse,
  OccupancyHousesRequest,
  UpdateHouseRequest,
  UpdateHouseResponse,
} from '@/types/services/houses/index';

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

    getCurrencyRevaluation: build.query<CurrencyRevaluationResponse, void>({
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
  useLazyGetHouseByIdQuery,
  useGetHouseByIdOccupancyQuery,
  useLazyGetHouseByIdOccupancyQuery,
  useGetCurrencyRevaluationQuery,
  useCreateHouseMutation,
  useUpdateHouseMutation,
  useGetHousesPerformanceQuery,
  useLazyGetHousesPerformanceQuery,
  useDeleteHouseMutation,
} = housesApi;
