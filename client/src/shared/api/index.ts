import { getClientApiBaseUrl } from '@/shared/constants/api-base-url';
import { isPublicAuthPath, ROUTES } from '@/shared/routes';
import { clearUser } from '@/store/slice/user-slice';
import type { Dispatch } from '@reduxjs/toolkit';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tokenStorage } from '../utils/auth';
import { refreshSession } from './refresh-session';

const baseUrl = getClientApiBaseUrl();

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

  if (typeof window !== 'undefined' && !isPublicAuthPath(window.location.pathname)) {
    window.location.href = ROUTES.LOGIN;
  }
};

function isAuthRoute(args: string | FetchArgs): boolean {
  const url = typeof args === 'string' ? args : args.url;
  return ['/auth/login', '/auth/refresh'].some(route => url === route || url.endsWith(route));
}

function isUnauthorized(error: FetchBaseQueryError | undefined): boolean {
  if (!error || !('status' in error)) {
    return false;
  }
  const { status } = error;
  return status === 401;
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (!isUnauthorized(result.error) || isAuthRoute(args)) {
    return result;
  }

  const outcome = await refreshSession();

  if (outcome === 'refreshed') {
    result = await baseQuery(args, api, extraOptions);
    return result;
  }

  if (outcome === 'unauthorized') {
    handleAuthError(api.dispatch);
  }

  return result;
};

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Houses', 'Analytics', 'Renters', 'Contracts', 'User', 'Meters', 'Tariffs'],
  endpoints: () => ({}),
});
