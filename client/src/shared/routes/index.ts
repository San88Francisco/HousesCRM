export const ROUTES = {
  LOGIN: '/login',
  ALL_APARTMENTS: '/all-apartments',
  HOME: '/',
  UIKIT: '/uikit',
};

export const ROUTES_WITH_SIDEBAR = [ROUTES.ALL_APARTMENTS, ROUTES.HOME, ROUTES.UIKIT] as const;

export const SIDEBAR_PATTERNS = [/^\/$/, /^\/all-apartments/, /^\/uikit/] as const;
