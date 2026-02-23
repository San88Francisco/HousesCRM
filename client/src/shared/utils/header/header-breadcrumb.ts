import { LEVELS } from '@/shared/constants/header/header-breadcrumb';
import { ROUTES } from '@/shared/routes';

const ROUTE_ORDER = [
  ROUTES.ALL_HOUSES,
  ROUTES.ALL_RENTERS,
  ROUTES.UIKIT,
  ROUTES.HOUSE,
  ROUTES.RENTER,
  ROUTES.CONTRACT,
  ROUTES.ALL_CONTRACTS,
] as const;

export const getLevelByPath = (pathname: string): number => {
  if (!pathname) return 1;
  for (const route of ROUTE_ORDER) {
    if (pathname.startsWith(route)) return LEVELS[route];
  }
  return 1;
};
