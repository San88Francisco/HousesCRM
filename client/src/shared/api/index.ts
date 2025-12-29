import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
// import type { Dispatch } from '@reduxjs/toolkit';

import { tokenStorage } from '../utils/auth/token';
// import { toast } from 'sonner';
// import { clearUser } from '@/store/user-slice';

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

// const handleTokenRefresh = async (): Promise<string | null> => {
//   try {
//     const refreshResult = await fetch(`${baseUrl}/auth/refresh`, {
//       method: 'POST',
//       credentials: 'include',
//     });

//     if (refreshResult.ok) {
//       const data = await refreshResult.json();
//       return data.accessToken || null;
//     }

//     return null;
//   } catch (error: unknown) {
//     toast.error(`Помилка запиту оновлення токена: ${String(error)}`);
//     return null;
//   }
// };

// const handleAuthError = (dispatch: Dispatch) => {
//   tokenStorage.clearTokens();

//   dispatch(clearUser());

//   if (typeof window !== 'undefined') {
//     window.location.href = '/login';
//   }
// };

// const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
//   args,
//   api,
//   extraOptions,
// ) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error && result.error.status === 401) {
//     const newAccessToken = await handleTokenRefresh();

//     if (newAccessToken) {
//       tokenStorage.setAccessToken(newAccessToken);
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       handleAuthError(api.dispatch);
//     }
//   }

//   return result;
// };

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['Auth', 'Houses', 'Analytics'],
  endpoints: () => ({}),
});
