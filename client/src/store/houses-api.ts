import { rootApi } from '@/shared/api';
import { AllAnalyticsResponse } from '@/types/services/all-analitics';
import { HouseByIdResponse } from '@/types/services/houses';
import { CurrencyRevaluation } from '@/types/core/currency-revaluation-chart/types';
import { House } from '@/types/services/houses';
import { CreateHousePayload } from '@/types/services/apartments-api';
import { CreateRenterPayload, RenterResponse } from '@/types/model/renter';

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
    createHouse: build.mutation<House, CreateHousePayload>({
      query: body => ({
        url: '/houses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Houses', 'Analytics'],
    }),
    updateHouse: build.mutation<House, { id: string } & Partial<CreateHousePayload>>({
      query: ({ id, ...body }) => ({
        url: `/houses/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Houses', id }, 'Houses', 'Analytics'],
    }),
    createRenter: build.mutation<RenterResponse, CreateRenterPayload>({
      query: body => ({
        url: '/renters',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Renters', 'Analytics'],
    }),

    updateRenter: build.mutation<RenterResponse, { id: string } & Partial<CreateRenterPayload>>({
      query: ({ id, ...body }) => ({
        url: `/renters/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Renters', id },
        'Renters',
        'Analytics',
      ],
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
  useCreateRenterMutation,
  useUpdateRenterMutation,
} = housesApi;
