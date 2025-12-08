import { rootApi } from '@/shared/api';
import { AllAnalyticsResponse } from '@/types/services/all-analitics';

export const AllAnaliticsApi = rootApi.injectEndpoints({
  overrideExisting: false,
  endpoints: build => ({
    getHousesAnalytics: build.query<AllAnalyticsResponse, void>({
      query: () => '/houses-analytics/all-analytics',
      providesTags: ['AllAnalitics'],
    }),
  }),
});

export const { useGetHousesAnalyticsQuery } = AllAnaliticsApi;
