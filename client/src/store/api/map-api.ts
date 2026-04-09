import { rootApi } from '@/shared/api';
import type { POI, GeocodeResult } from '@/widgets/map/types';

export interface BulkPoiRequest {
  points: { lat: number; lng: number }[];
}

export const mapApi = rootApi.injectEndpoints({
  overrideExisting: false,
  endpoints: build => ({
    getMapPoi: build.query<POI[], { lat: number; lng: number }>({
      query: ({ lat, lng }) => ({
        url: '/map/poi',
        params: { lat, lng },
      }),
    }),

    getMapPoiBulk: build.mutation<POI[], BulkPoiRequest>({
      query: body => ({
        url: '/map/poi/bulk',
        method: 'POST',
        body,
      }),
    }),

    getMapGeocode: build.query<GeocodeResult | null, string>({
      query: street => ({
        url: '/map/geocode',
        params: { street },
      }),
    }),
  }),
});

export const {
  useGetMapPoiQuery,
  useLazyGetMapPoiQuery,
  useGetMapPoiBulkMutation,
  useGetMapGeocodeQuery,
  useLazyGetMapGeocodeQuery,
} = mapApi;
