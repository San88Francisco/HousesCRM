import { rootApi } from '@/shared/api';
import { HouseResponse, HousesAllAnalyticsResponse } from '@/types/services/houses';

export const housesApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getHousesAnalytics: build.query<HousesAllAnalyticsResponse, void>({
      query: () => '/houses-analytics/all-analytics',
      providesTags: ['Houses'],
    }),
    getHouseById: build.query<HouseResponse, string>({
      query: id => `/houses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Houses', id }],
    }),
  }),
});

export const { useGetHouseByIdQuery, useLazyGetHousesAnalyticsQuery, useGetHousesAnalyticsQuery } =
  housesApi;
