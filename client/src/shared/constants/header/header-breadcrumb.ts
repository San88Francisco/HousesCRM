import { ROUTES } from '@/shared/routes';

export const STORAGE_KEY = 'breadcrumb-trail';

export const STATIC_LABELS: Record<string, string> = {
  [ROUTES.ALL_HOUSES]: 'Всі Квартири',
  [ROUTES.ALL_RENTERS]: 'Всі Орендарі',
  [ROUTES.ALL_CONTRACTS]: 'Всі Контракти',
  [ROUTES.MAP]: 'Карта',
  [ROUTES.PROFILE]: 'Профіль',
  [ROUTES.PROFILE_PERSONAL]: 'Особисті дані',
  [ROUTES.PROFILE_CONTRACTS]: 'Інформація для контрактів',
  [ROUTES.PROFILE_PASSWORD]: 'Змінити пароль',
};

export const LEVELS: Record<string, number> = {
  [ROUTES.ALL_HOUSES]: 1,
  [ROUTES.ALL_RENTERS]: 1,
  [ROUTES.ALL_CONTRACTS]: 1,
  [ROUTES.MAP]: 1,
  [ROUTES.PROFILE]: 1,
  [ROUTES.HOUSE]: 2,
  [ROUTES.RENTER]: 3,
  [ROUTES.CONTRACT]: 2,
};
