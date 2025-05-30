import { rootApi } from "@/services/api"
import type { LoginRequest, LoginResponse } from "@/types/services/login"



export const authApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: `/login`,
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useLoginMutation } = authApi