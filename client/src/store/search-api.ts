import { rootApi } from '@/shared/api';
import { SearchRequest, SearchResponse } from '@/types/services/search';

export const searchApi = rootApi.injectEndpoints({
  endpoints: build => ({
    getAllSearch: build.query<SearchResponse, SearchRequest>({
      query: ({ query }) => ({
        url: `/search`,
        params: { term: query },
      }),
    }),
  }),
});

export const { useLazyGetAllSearchQuery } = searchApi;
