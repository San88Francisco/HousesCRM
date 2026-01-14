import { rootApi } from '@/shared/api';
import { House } from '@/types/core/house';
import { Renter } from '@/types/core/renter';
import {
  ApiEndpointBuilder,
  ApiTagTypes,
  AutoCompleteRequest,
  LazyLoadingAutocomplete,
} from '@/types/services/lazy-loading-autocomplete';

type Props<T> = {
  url: string;
  tagType: ApiTagTypes;
  getItemId: (item: T) => string | number;
};

export function lazyLoadingAutocomplete<T>(build: ApiEndpointBuilder, config: Props<T>) {
  const { url, tagType, getItemId } = config;

  return build.query<LazyLoadingAutocomplete<T>, AutoCompleteRequest>({
    query: ({ page, limit }) => ({
      url,
      params: { page, limit },
    }),

    serializeQueryArgs: ({ endpointName }) => endpointName,

    merge: (currentCache, newData, { arg }) => {
      if (arg.page === 1) {
        return newData;
      }

      const existingIds = new Set(currentCache.data.map(getItemId));
      const newItems = newData.data.filter(item => !existingIds.has(getItemId(item)));

      return {
        data: [...currentCache.data, ...newItems],
        meta: newData.meta,
      };
    },

    forceRefetch({ currentArg, previousArg, endpointState }) {
      const cachedResponse = endpointState?.data as LazyLoadingAutocomplete<T> | undefined;
      const hasCachedData = cachedResponse?.data && cachedResponse.data.length > 0;

      if (currentArg?.page === 1 && hasCachedData) {
        return false;
      }

      return currentArg?.page !== previousArg?.page;
    },

    providesTags: result =>
      result
        ? [
            ...result.data.map(item => ({
              type: tagType,
              id: getItemId(item),
            })),
            { type: tagType, id: 'LIST' },
          ]
        : [{ type: tagType, id: 'LIST' }],
  });
}

export const housesApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getAllHousesAutocomplete: lazyLoadingAutocomplete<House>(build, {
      url: '/houses',
      tagType: 'Houses',
      getItemId: house => house.id,
    }),
    getAllRentersAutocomplete: lazyLoadingAutocomplete<Renter>(build, {
      url: '/renters',
      tagType: 'Renters',
      getItemId: renter => renter.id,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllHousesAutocompleteQuery, useGetAllRentersAutocompleteQuery } = housesApi;
