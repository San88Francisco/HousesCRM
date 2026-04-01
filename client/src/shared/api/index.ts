import { clearUser } from '@/store/slice/user-slice';
import type { RefreshResponse } from '@/types/services/auth';
import type { Dispatch } from '@reduxjs/toolkit';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tokenStorage } from '../utils/auth';

import { Mutex } from 'async-mutex';

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

const mutex = new Mutex();

function isAuthLoginRequest(args: string | FetchArgs): boolean {
  const url = typeof args === 'string' ? args : args.url;
  return url === '/auth/login' || url.endsWith('/auth/login');
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && isAuthLoginRequest(args)) {
    return result;
  }

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
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
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
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
