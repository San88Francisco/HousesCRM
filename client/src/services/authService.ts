// authService.ts
import cookies from "js-cookie";

export const getToken = () => {
  return cookies.get("accessToken");
};
