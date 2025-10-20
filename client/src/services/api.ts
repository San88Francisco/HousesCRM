import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import cookies from 'js-cookie';

// Mutex для запобігання одночасних запитів на refresh
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://troubled-paula-step-029fdb19.koyeb.app/api',
  credentials: 'include', // ВАЖЛИВО: для передачі cookies з refresh токеном
  prepareHeaders: headers => {
    const token = cookies.get('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Обгортка для автоматичного refresh токена
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // Чекаємо, поки mutex звільниться
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  // Якщо отримали 401 - токен протермінований
  if (result.error && result.error.status === 401) {
    // Перевіряємо, чи mutex вже зайнятий
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // Спробуємо оновити токен
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'GET',
            credentials: 'include', // Бекенд отримає refresh token з cookies
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          // Бекенд повертає новий access token
          const { accessToken } = refreshResult.data as { accessToken: string };

          // Зберігаємо новий access token
          cookies.set('accessToken', accessToken, {
            expires: 1, // 1 день
            path: '/',
          });

          // Повторюємо оригінальний запит з новим токеном
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh не вдався - очищаємо токени і редиректимо на логін
          cookies.remove('accessToken');
          window.location.href = '/login';
        }
      } finally {
        release();
      }
    } else {
      // Чекаємо, поки інший запит оновить токен
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
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
