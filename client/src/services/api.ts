import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/auth/refreshToken';

// Базовий query без обробки refresh token
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000',
  prepareHeaders: headers => {
    const token = getAccessToken();
    console.log('🔑 Current access token:', token ? `${token.substring(0, 20)}...` : 'None');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

// Обгортка для автоматичного refresh token
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  console.log('🚀 Making request:', args);

  // Виконуємо початковий запит
  let result = await baseQuery(args, api, extraOptions);

  console.log('📡 Initial request result:', {
    status: result.error?.status,
    hasError: !!result.error,
    hasData: !!result.data,
  });

  // Якщо отримали 401 або 403 помилку, спробуємо оновити токен
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    console.log('❌ Got 401/403 error, attempting to refresh token...');

    const refreshToken = getRefreshToken();
    console.log('🔄 Refresh token available:', !!refreshToken);

    if (refreshToken) {
      try {
        console.log('📤 Sending refresh request to /api/auth/refresh');

        // Спробуємо оновити токени - виправлений URL
        const refreshResponse = await fetch('http://localhost:5000/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        console.log('📥 Refresh response status:', refreshResponse.status);

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          console.log('✅ Refresh successful, got new tokens');
          console.log(
            '🔑 New access token:',
            refreshData.accessToken ? `${refreshData.accessToken.substring(0, 20)}...` : 'None',
          );

          // Зберігаємо нові токени
          setTokens(refreshData.accessToken, refreshData.refreshToken);

          console.log('🔁 Retrying original request with new token...');
          // Повторюємо початковий запит з новим токеном
          result = await baseQuery(args, api, extraOptions);

          console.log('📡 Retry request result:', {
            status: result.error?.status,
            hasError: !!result.error,
            hasData: !!result.data,
          });
        } else {
          console.log('❌ Refresh failed with status:', refreshResponse.status);
          const errorText = await refreshResponse.text();
          console.log('❌ Refresh error details:', errorText);

          // Якщо refresh не вдався, очищаємо токени і перенаправляємо на логін
          clearTokens();
          console.log('🧹 Tokens cleared, redirecting to login...');

          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('💥 Error during token refresh:', error);
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    } else {
      console.log('❌ No refresh token available, redirecting to login...');
      // Немає refresh token, перенаправляємо на логін
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  return result;
};

export const rootApi = createApi({
  reducerPath: 'api',
  tagTypes: ['Auth'],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
