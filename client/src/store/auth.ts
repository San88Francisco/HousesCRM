import { rootApi } from '@/services/api';
import type { LoginRequest, LoginResponse } from '@/types/services/login';

export const authApi = rootApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: `/auth/login`,
        method: 'POST',
        body,
        credentials: 'include', // Додаємо для отримання refresh token в cookie
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;
