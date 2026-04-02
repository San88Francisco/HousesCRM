import { rootApi } from '@/shared/api';
import { ROUTES } from '@/shared/routes';
import { tokenStorage } from '@/shared/utils/auth';
import type { LoginRequest, LoginResponse } from '@/types/services/auth';
import { toast } from 'sonner';
import { clearUser } from '../slice/user-slice';

export const authApi = rootApi.injectEndpoints({
  endpoints: build => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: body => ({
        url: `/auth/login`,
        method: 'POST',
        body,
      }),
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

export const { useLoginMutation, useLogoutMutation } = authApi;
