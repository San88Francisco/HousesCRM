export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ALL_APARTMENTS: '/all-apartments',
  APARTMENT: '/apartment',
  RENTER: '/renter',
  CONTRACT: '/contract',
  UIKIT: '/uikit',
};

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const SIDEBAR_PATTERNS = [
  /^\/$/,
  /^\/all-apartments/,
  /^\/uikit/,
  /^\/apartment/,
  /^\/renter/,
  /^\/contract/,
] as const;
