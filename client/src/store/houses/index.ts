import { rootApi } from '@/shared/api';

export const housesApi = rootApi.injectEndpoints({
  endpoints: build => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getHousesAnalytics: build.query<any, void>({
      query: () => '/houses-analytics/all-analytics',
      providesTags: ['Houses'],
    }),
  }),
});

export const { useGetHousesAnalyticsQuery, useLazyGetHousesAnalyticsQuery } = housesApi;
