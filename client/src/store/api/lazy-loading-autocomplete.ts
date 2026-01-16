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

      const existingIds = new Set(currentCache?.data?.map(getItemId) ?? []);
      const newItems = newData.data.filter(item => !existingIds.has(getItemId(item)));

      return {
        data: [...(currentCache?.data ?? []), ...newItems],
        meta: newData.meta,
      };
    },

    providesTags: result =>
      result
        ? [
            ...result.data.map(item => ({ type: tagType, id: getItemId(item) })),
            { type: tagType, id: 'LIST' },
          ]
        : [{ type: tagType, id: 'LIST' }],
  });
}

export const autocompleteApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getHousesAutocomplete: lazyLoadingAutocomplete<House>(build, {
      url: '/houses',
      tagType: 'Houses',
      getItemId: house => house.id,
    }),

    getRentersAutocomplete: lazyLoadingAutocomplete<Renter>(build, {
      url: '/renters',
      tagType: 'Renters',
      getItemId: renter => renter.id,
    }),
  }),
  overrideExisting: false,
});

export const { useGetHousesAutocompleteQuery, useGetRentersAutocompleteQuery } = autocompleteApi;
