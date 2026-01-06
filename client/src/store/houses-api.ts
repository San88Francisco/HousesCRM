import { rootApi } from '@/shared/api';
import { CurrencyRevaluation } from '@/types/core/currency-revaluation-chart/types';
import {
  HousesPerformanceRequest,
  HousesPerformanceResponse,
} from '@/types/core/houses-performance/types';
import type { HouseCoordinates } from '@/types/model/geo-map-3d/house-coordinates';
import { AllAnalyticsResponse } from '@/types/services/all-analitics';
import {
  CreateHousePayload,
  House,
  HouseByIdResponse,
  UpdateHousePayload,
} from '@/types/services/houses';

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

    updateHouse: build.mutation<House, { id: string } & Partial<Omit<UpdateHousePayload, 'id'>>>({
      query: ({ id, ...body }) => ({
        url: `/houses/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Houses', id }, 'Houses', 'Analytics'],
    }),

    getHousesPerformance: build.query<HousesPerformanceResponse, HousesPerformanceRequest>({
      query: ({ page, limit, sortBy, order }) => ({
        url: '/houses-analytics/houses-performance-analytic',
        params: {
          page,
          limit,
          sortBy,
          order,
        },
      }),
      providesTags: ['Houses'],
    }),

    getHousesForMap: build.query<HouseCoordinates[], void>({
      query: () => '/houses/map',
      transformResponse: (
        response: Array<{ id: string; apartmentName: string; street: string }>,
      ) => {
        return response.map(house => ({
          id: house.id,
          lng: 0,
          lat: 0,
          apartmentName: house.apartmentName,
          street: house.street,
        }));
      },
      providesTags: ['Houses'],
    }),

    geocodeAddress: build.query<
      { lat: number; lng: number; displayName: string } | null,
      { address: string; city: string }
    >({
      query: ({ address, city }) => ({
        url: '/houses/geocode',
        params: { address, city },
      }),
      transformResponse: (response: { lat: number; lng: number; displayName: string } | null) => {
        return response;
      },
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
  useGetHousesPerformanceQuery,
  useLazyGetHousesPerformanceQuery,
  useGetHousesForMapQuery,
  useLazyGeocodeAddressQuery,
} = housesApi;
