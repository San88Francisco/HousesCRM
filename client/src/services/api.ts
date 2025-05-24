import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const rootApi = createApi({
  reducerPath: "api",
  tagTypes: ["Auth"],
  baseQuery: fetchBaseQuery({
    // Використовуємо повний URL до бекенду
    baseUrl: "http://localhost:5000",
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined"
          ? document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1")
          : null

      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
    // Додаємо credentials для передачі кук
    credentials: 'include',
  }),
  endpoints: () => ({}),
})