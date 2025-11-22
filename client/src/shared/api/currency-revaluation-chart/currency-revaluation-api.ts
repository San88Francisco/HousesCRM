import { rootApi } from '@/shared/api/index';
import { CurrencyRevaluation } from '@/types/core/currency-revaluation-chart/types';

export const currencyRevaluationApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getCurrencyRevaluation: builder.query<CurrencyRevaluation[], void>({
      query: () => '/api/houses-analytics/currency-revaluation-analytic',
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetCurrencyRevaluationQuery } = currencyRevaluationApi;
