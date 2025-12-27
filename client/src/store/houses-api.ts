import { rootApi } from '@/shared/api';
import { AllAnalyticsResponse } from '@/types/services/all-analitics';
import {
  CreateHousePayload,
  HouseByIdResponse,
  HousePayload,
  UpdateHousePayload,
} from '@/types/services/houses';
import { CurrencyRevaluation } from '@/types/core/currency-revaluation-chart/types';

export const housesApi = rootApi.injectEndpoints({
  overrideExisting: false,
  endpoints: build => ({
    getHousesAnalytics: build.query<AllAnalyticsResponse, void>({
      query: () => '/houses-analytics/all-analytics',
      providesTags: ['Analytics'],
    }),

    getHouseById: build.query<HouseByIdResponse, string>({
      query: id => `/houses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Houses', id }],
    }),

    getCurrencyRevaluation: build.query<CurrencyRevaluation[], void>({
      query: () => '/houses-analytics/currency-revaluation-analytic',
      providesTags: ['Analytics'],
    }),

    createHouse: build.mutation<HousePayload, CreateHousePayload>({
      query: body => ({
        url: '/houses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Houses', 'Analytics'],
    }),

    updateHouse: build.mutation<HousePayload, Partial<UpdateHousePayload>>({
      query: ({ id, ...body }) => ({
        url: `/houses/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Houses', id }, 'Houses', 'Analytics'],
    }),
  }),
});

export const {
  useGetHousesAnalyticsQuery,
  useLazyGetHousesAnalyticsQuery,
  useGetHouseByIdQuery,
  useGetCurrencyRevaluationQuery,
  useCreateHouseMutation,
  useUpdateHouseMutation,
} = housesApi;
