export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ALL_HOUSES: '/all-houses',
  HOUSE: '/house',
  RENTER: '/renter',
  CONTRACT: '/contract',
  UIKIT: '/uikit',
};

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

export const SIDEBAR_PATTERNS = [
  /^\/$/,
  /^\/all-houses/,
  /^\/uikit/,
  /^\/house/,
  /^\/renter/,
  /^\/contract/,
] as const;
