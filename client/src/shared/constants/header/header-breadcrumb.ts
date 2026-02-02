import { ROUTES } from '@/shared/routes';

export const STORAGE_KEY = 'breadcrumb-trail';

export const STATIC_LABELS: Record<string, string> = {
  [ROUTES.ALL_HOUSES]: 'Всі Квартири',
  [ROUTES.ALL_RENTERS]: 'Всі Орендарі',
  [ROUTES.UIKIT]: 'UI Kit',
};

export const LEVELS: Record<string, number> = {
  [ROUTES.ALL_HOUSES]: 1,
  [ROUTES.ALL_RENTERS]: 1,
  [ROUTES.UIKIT]: 1,
  [ROUTES.HOUSE]: 2,
  [ROUTES.RENTER]: 3,
  [ROUTES.CONTRACT]: 2,
};
