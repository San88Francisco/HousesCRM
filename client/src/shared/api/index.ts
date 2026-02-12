import { clearUser } from '@/store/slice/user-slice';
import type { RefreshResponse } from '@/types/services/auth';
import type { Dispatch } from '@reduxjs/toolkit';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tokenStorage } from '../utils/auth';

const rawBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');
const baseUrl = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: headers => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const handleAuthError = (dispatch: Dispatch) => {
  tokenStorage.clearTokens();
  dispatch(clearUser());

  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as RefreshResponse;
      tokenStorage.setAccessToken(accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      handleAuthError(api.dispatch);
    }
  }

  return result;
};

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Houses', 'Analytics', 'Renters', 'Contracts'],
  endpoints: () => ({}),
});
