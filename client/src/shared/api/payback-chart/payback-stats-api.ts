import { rootApi } from '@/shared/api/index';
import { HousePaybackStats } from '@/types/core/payback-chart/analytics';

interface PaybackStatsResponse {
  housesPaybackStats: HousePaybackStats[];
}

export const paybackStatsApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getPaybackStats: builder.query<HousePaybackStats[], void>({
      query: () => '/houses-analytics/house-payback-stats-analytic',
      transformResponse: (response: PaybackStatsResponse) => response.housesPaybackStats,
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetPaybackStatsQuery } = paybackStatsApi;
