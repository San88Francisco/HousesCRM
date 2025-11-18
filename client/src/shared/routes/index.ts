export const ROUTES = {
  LOGIN: '/login',
  ALL_APARTMENTS: '/all-apartments',
  HOME: '/',
  UIKIT: '/uikit',
};

export const SIDEBAR_PATTERNS = [/^\/$/, /^\/all-apartments/, /^\/uikit/] as const;
