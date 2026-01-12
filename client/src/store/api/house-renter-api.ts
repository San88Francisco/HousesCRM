// @/shared/constants/autocomplete.ts
export const AUTOCOMPLETE_PAGE_LIMIT = 10;
export const AUTOCOMPLETE_INTERSECTION_ROOT_MARGIN = '100px';
export const AUTOCOMPLETE_SEARCH_DEBOUNCE = 300;
// @/types/services/houses.ts
import { House } from '@/types/core/house';

export interface HousesPaginatedRequest {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface HousesPaginatedResponse {
  data: House[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// @/types/services/renters.ts
import { Renter } from '@/types/core/renter';

export interface RentersPaginatedRequest {
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface RentersPaginatedResponse {
  data: Renter[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
// @/store/api/houses-api.ts
import { rootApi } from '@/shared/api';

// @/store/api/houses-api.ts

export const housesApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getAllHouses: build.query<HousesPaginatedResponse, HousesPaginatedRequest>({
      query: ({ sortBy = 'totalRevenue', order = 'DESC', page, limit }) => ({
        url: '/houses',
        params: {
          page,
          limit,
          sortBy,
          order,
        },
      }),

      serializeQueryArgs: ({ endpointName }) => {
        // Тепер кешуємо всі houses разом (без search)
        return endpointName;
      },

      merge: (currentCache, newData, { arg }) => {
        if (arg.page === 1) {
          if (!currentCache.data || currentCache.data.length === 0) {
            return newData;
          }
          return currentCache;
        }

        const existingIds = new Set(currentCache.data.map(house => house.id));
        const newHouses = newData.data.filter(house => !existingIds.has(house.id));

        return {
          data: [...currentCache.data, ...newHouses],
          meta: newData.meta,
        };
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },

      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Houses' as const, id })),
              { type: 'Houses', id: 'LIST' },
            ]
          : [{ type: 'Houses', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllHousesQuery } = housesApi;

// @/store/api/renters-api.ts (додати до існуючого)

// -=-=-=-=-=-=-=-=-=-=-===========================--=--=-=-=-==-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=--=-=-=-=-
// @/store/api/renters-api.ts (додати до існуючого)

export const rentersApi = rootApi.injectEndpoints({
  endpoints: build => ({
    // ... existing getAllContractsByRenterId endpoint

    getAllRenters: build.query<RentersPaginatedResponse, RentersPaginatedRequest>({
      query: ({ sortBy = 'occupied', order = 'DESC', page, limit }) => ({
        url: '/renters',
        params: {
          page,
          limit,
          sortBy,
          order,
        },
      }),

      serializeQueryArgs: ({ endpointName }) => {
        // Тепер кешуємо всі renters разом (без search)
        return endpointName;
      },

      merge: (currentCache, newData, { arg }) => {
        if (arg.page === 1) {
          if (!currentCache.data || currentCache.data.length === 0) {
            return newData;
          }
          return currentCache;
        }

        const existingIds = new Set(currentCache.data.map(renter => renter.id));
        const newRenters = newData.data.filter(renter => !existingIds.has(renter.id));

        return {
          data: [...currentCache.data, ...newRenters],
          meta: newData.meta,
        };
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },

      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Renters' as const, id })),
              { type: 'Renters', id: 'LIST' },
            ]
          : [{ type: 'Renters', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllRentersQuery } = rentersApi;
