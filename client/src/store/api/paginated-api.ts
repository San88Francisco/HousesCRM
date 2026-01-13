import { rootApi } from '@/shared/api';
import { House } from '@/types/core/house';
import { Renter } from '@/types/core/renter';
import { PaginationRequest } from '@/types/pagination';
import { ApiEndpointBuilder, ApiTagTypes, PaginatedResponse } from '@/types/services/pagination';

type CreatePaginatedEndpointConfig<T> = {
  url: string;
  tagType: ApiTagTypes;
  defaultSortBy: string;
  defaultOrder?: 'ASC' | 'DESC';
  getItemId: (item: T) => string | number;
};

export function createPaginatedEndpoint<T>(
  build: ApiEndpointBuilder,
  config: CreatePaginatedEndpointConfig<T>,
) {
  const { url, tagType, defaultSortBy, defaultOrder = 'DESC', getItemId } = config;

  return build.query<PaginatedResponse<T>, PaginationRequest>({
    query: ({ sortBy = defaultSortBy, order = defaultOrder, page, limit }) => ({
      url,
      params: { page, limit, sortBy, order },
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
      const cachedResponse = endpointState?.data as PaginatedResponse<T> | undefined;
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

export const AUTOCOMPLETE_PAGE_LIMIT = 10;
export const AUTOCOMPLETE_INTERSECTION_ROOT_MARGIN = '100px';
export const AUTOCOMPLETE_SEARCH_DEBOUNCE = 300;

export const housesApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getAllHouses: createPaginatedEndpoint<House>(build, {
      url: '/houses',
      tagType: 'Houses',
      defaultSortBy: 'totalRevenue',
      getItemId: house => house.id,
    }),
    getAllRenters: createPaginatedEndpoint<Renter>(build, {
      url: '/renters',
      tagType: 'Renters',
      defaultSortBy: 'occupied',
      getItemId: renter => renter.id,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllHousesQuery, useGetAllRentersQuery } = housesApi;
