import { rootApi } from '@/shared/api';
import {
  CreateHouseRequest,
  House,
  HouseResponse,
  HousesAllAnalyticsResponse,
} from '@/types/services/houses';

export const housesApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getHousesAnalytics: build.query<HousesAllAnalyticsResponse, void>({
      query: () => '/houses-analytics/all-analytics',
      providesTags: ['Houses'],
    }),
    getHouseById: build.query<HouseResponse, string>({
      query: id => `/houses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Houses', id }],
    }),

    // Мутація для створення квартири
    createHouse: build.mutation<House, CreateHouseRequest>({
      query: body => ({
        url: '/houses',
        method: 'POST',
        body,
      }),
      // Інвалідує кеш після успішного створення
      invalidatesTags: ['Houses'],
    }),
    // store/houses.ts
    updateHouse: build.mutation<House, { id: string } & Partial<CreateHouseRequest>>({
      query: ({ id, ...body }) => ({
        url: `/houses/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Houses', id }, 'Houses'],
    }),
  }),
});

export const {
  useGetHouseByIdQuery,
  useLazyGetHousesAnalyticsQuery,
  useGetHousesAnalyticsQuery,
  useCreateHouseMutation,
  useUpdateHouseMutation,
} = housesApi;
