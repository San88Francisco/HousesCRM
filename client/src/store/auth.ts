import { rootApi } from '@/shared/api';
import type { LoginRequest, LoginResponse, RefreshResponse } from '@/types/services/login';

export const authApi = rootApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: `/auth/login`,
        method: 'POST',
        body,
      }),
    }),
    refresh: build.mutation<RefreshResponse, void>({
      query: () => ({
        url: `/auth/refresh`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation } = authApi;
