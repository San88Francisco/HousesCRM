import { rootApi } from '@/shared/api';
import type {
  ChangePasswordRequest,
  ProfileResponse,
  UpdateProfileRequest,
} from '@/types/services/user';

export const usersApi = rootApi.injectEndpoints({
  overrideExisting: false,
  endpoints: build => ({
    getProfile: build.query<ProfileResponse, void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    updateProfile: build.mutation<ProfileResponse, UpdateProfileRequest>({
      query: body => ({
        url: '/users',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: build.mutation<{ ok: boolean }, ChangePasswordRequest>({
      query: body => ({
        url: '/users/password',
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } = usersApi;
