import { rootApi } from '@/shared/api';
import {
  HousesPerformanceRequest,
  HousesPerformanceResponse,
} from '@/types/core/houses-performance/types';
import { AllAnalyticsResponse } from '@/types/services/all-analitics';
import { HouseByIdResponse } from '@/types/services/houses';

export const housesApi = rootApi.injectEndpoints({
  overrideExisting: false,
  endpoints: build => ({
    getHousesAnalytics: build.query<AllAnalyticsResponse, void>({
      query: () => '/houses-analytics/all-analytics',
      providesTags: ['Houses'],
    }),
    getHouseById: build.query<HouseByIdResponse, string>({
      query: id => `/houses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Houses', id }],
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
  useGetHousesAnalyticsQuery,
  useLazyGetHousesAnalyticsQuery,
  useGetHouseByIdQuery,
  useGetHousesPerformanceQuery,
  useLazyGetHousesPerformanceQuery,
} = housesApi;
