import { rootApi } from '@/shared/api';
import { AllAnaliticsRespond } from '@/types/services/all-analitics';

export const AllAnaliticsApi = rootApi.injectEndpoints({
  overrideExisting: false,
  endpoints: build => ({
    getHousesAnalytics: build.query<AllAnaliticsRespond, void>({
      query: () => '/houses-analytics/all-analytics',
      providesTags: ['AllAnalitics'],
    }),
  }),
});

export const { useGetHousesAnalyticsQuery } = AllAnaliticsApi;
