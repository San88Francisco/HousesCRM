import { rootApi } from '@/shared/api';

import {
  CreateMeterReadingRequest,
  CreateUtilityTariffRequest,
  DeleteMeterReadingRequest,
  MeterReading,
  MeterReadingsRequest,
  MeterReadingsResponse,
  UtilitySummaryResponse,
  UtilityTariff,
  UtilityType,
} from '@/types/services/meters';

const metersTag = (houseId: string, utilityType: UtilityType) => ({
  type: 'Meters' as const,
  id: `${houseId}-${utilityType}`,
});

export const metersApi = rootApi.injectEndpoints({
  overrideExisting: false,
  endpoints: build => ({
    getMeterReadings: build.query<MeterReadingsResponse, MeterReadingsRequest>({
      query: ({ houseId, utilityType }) => ({
        url: `/houses/${houseId}/meter-readings`,
        params: { utilityType },
      }),
      providesTags: (_result, _error, { houseId, utilityType }) => [
        metersTag(houseId, utilityType),
        'Meters',
      ],
    }),

    createMeterReading: build.mutation<MeterReading, CreateMeterReadingRequest>({
      query: ({ houseId, ...body }) => ({
        url: `/houses/${houseId}/meter-readings`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { houseId, utilityType }) => [
        metersTag(houseId, utilityType),
      ],
    }),

    deleteMeterReading: build.mutation<void, DeleteMeterReadingRequest>({
      query: ({ houseId, id }) => ({
        url: `/houses/${houseId}/meter-readings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { houseId, utilityType }) => [
        metersTag(houseId, utilityType),
      ],
    }),

    getUtilitySummary: build.query<UtilitySummaryResponse, string>({
      query: houseId => `/houses/${houseId}/meter-readings/summary`,
      providesTags: ['Meters'],
    }),

    getUtilityTariffs: build.query<UtilityTariff[], UtilityType>({
      query: utilityType => ({
        url: '/utility-tariffs',
        params: { utilityType },
      }),
      providesTags: (_result, _error, utilityType) => [
        { type: 'Tariffs', id: utilityType },
        'Tariffs',
      ],
    }),

    createUtilityTariff: build.mutation<UtilityTariff, CreateUtilityTariffRequest>({
      query: body => ({
        url: '/utility-tariffs',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { utilityType }) => [
        { type: 'Tariffs', id: utilityType },
        'Meters',
      ],
    }),

    deleteUtilityTariff: build.mutation<void, string>({
      query: id => ({
        url: `/utility-tariffs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tariffs', 'Meters'],
    }),
  }),
});

export const {
  useGetMeterReadingsQuery,
  useGetUtilitySummaryQuery,
  useCreateMeterReadingMutation,
  useDeleteMeterReadingMutation,
  useGetUtilityTariffsQuery,
  useCreateUtilityTariffMutation,
  useDeleteUtilityTariffMutation,
} = metersApi;
