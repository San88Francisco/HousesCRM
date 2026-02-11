import { rootApi } from '@/shared/api';
import { ROUTES } from '@/shared/routes';
import { tokenStorage } from '@/shared/utils/auth';
import type { LoginRequest, LoginResponse, RefreshResponse } from '@/types/services/auth';
import { toast } from 'sonner';
import { clearUser, setUser } from '../slice/user-slice';

export const authApi = rootApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: `/auth/login`,
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          if (data.accessToken) {
            tokenStorage.setAccessToken(data.accessToken);
          }

          if (data.email) {
            const userData = {
              email: data.email,
              username: data.username,
            };

            tokenStorage.setUserData(userData);

            dispatch(setUser(userData));
          }
        } catch {
          toast.error('Невірні облікові дані або помилка авторизації');
        }
      },
    }),

    refresh: build.mutation<RefreshResponse, void>({
      query: () => ({
        url: `/auth/refresh`,
        method: 'POST',
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.accessToken) {
            tokenStorage.setAccessToken(data.accessToken);
          }
        } catch {
          toast.error('Упсс щось пішло не так!');
        }
      },
    }),

    logout: build.mutation<{ ok: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch {
          toast.error('Упсс щось пішло не так!');
        } finally {
          tokenStorage.clearTokens();
          dispatch(clearUser());
          dispatch(rootApi.util.resetApiState());

          window.location.replace(ROUTES.LOGIN);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation } = authApi;
