import { LEVELS } from '@/shared/constants/header/header-breadcrumb';
import { ROUTES } from '@/shared/routes';

export const getLevelByPath = (pathname: string) => {
  if (!pathname) return 1;
  if (pathname.startsWith(ROUTES.ALL_HOUSES)) return LEVELS[ROUTES.ALL_HOUSES];
  if (pathname.startsWith(ROUTES.ALL_RENTERS)) return LEVELS[ROUTES.ALL_RENTERS];
  if (pathname.startsWith(ROUTES.UIKIT)) return LEVELS[ROUTES.UIKIT];
  if (pathname.startsWith(ROUTES.HOUSE)) return LEVELS[ROUTES.HOUSE];
  if (pathname.startsWith(ROUTES.RENTER)) return LEVELS[ROUTES.RENTER];
  if (pathname.startsWith(ROUTES.CONTRACT)) return LEVELS[ROUTES.CONTRACT];
  return 1;
};
