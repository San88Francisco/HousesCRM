import { ROUTES } from '@/shared/routes';

export enum DeleteAction {
  HOUSE = 'DELETE_HOUSE',
  RENTER = 'DELETE_RENTER',
  CONTRACT = 'DELETE_CONTRACT',
}

export const DELETE_ACTION_CONFIG = {
  [DeleteAction.HOUSE]: {
    title: 'Видалити квартиру?',
    description: 'Ви впевнені, що хочете видалити цю квартиру? Цю дію неможливо буде скасувати.',
    redirectUrl: ROUTES.ALL_HOUSES,
    successMessage: 'Квартиру успішно видалено!',
  },
  [DeleteAction.RENTER]: {
    title: 'Видалити орендаря?',
    description: 'Ви впевнені, що хочете видалити цього орендаря? Цю дію неможливо буде скасувати.',
    redirectUrl: ROUTES.ALL_HOUSES,
    successMessage: 'Орендаря успішно видалено!',
  },
  [DeleteAction.CONTRACT]: {
    title: 'Видалити контракт?',
    description: 'Ви впевнені, що хочете видалити цей контракт? Цю дію неможливо буде скасувати.',
    successMessage: 'Контракт успішно видалено!',
  },
} as const;
