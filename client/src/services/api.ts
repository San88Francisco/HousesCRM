import { getAccessToken } from '@/utils/auth/token';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: headers => {
      const token = getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: () => ({}),
});
