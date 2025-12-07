import { rootApi } from '@/shared/api';
import { HouseResponse } from '@/types/services/houses';

export const housesApi = rootApi.injectEndpoints({
  endpoints: build => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getHousesAnalytics: build.query<any, void>({
      query: () => '/houses-analytics/all-analytics',
      providesTags: ['Houses'],
    }),
    getHouseById: build.query<HouseResponse, string>({
      query: id => `/houses/${id}`,
    }),
  }),
});

export const { useGetHouseByIdQuery, useLazyGetHousesAnalyticsQuery } = housesApi;
