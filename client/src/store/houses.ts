import { rootApi } from '@/shared/api';
import { AllAnalyticsResponse } from '@/types/services/all-analitics';
import { HouseResponse } from '@/types/services/houses';

export const AllAnaliticsApi = rootApi.injectEndpoints({
  overrideExisting: false,
  endpoints: build => ({
    getHousesAnalytics: build.query<AllAnalyticsResponse, void>({
      query: () => '/houses-analytics/all-analytics',
      providesTags: ['AllAnalitics'],
    }),
    getHouseById: build.query<HouseResponse, string>({
      query: id => `/houses/${id}`,
    }),
  }),
});

export const { useGetHousesAnalyticsQuery, useGetHouseByIdQuery } = AllAnaliticsApi;
