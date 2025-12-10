import { rootApi } from '@/shared/api';
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
  }),
});

export const { useGetHousesAnalyticsQuery, useLazyGetHousesAnalyticsQuery, useGetHouseByIdQuery } =
  housesApi;
