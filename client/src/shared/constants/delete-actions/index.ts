import { ROUTES } from '@/shared/routes';

export enum DeleteAction {
  HOUSE = 'DELETE_HOUSE',
  RENTER = 'DELETE_RENTER',
  CONTRACT = 'DELETE_CONTRACT',
  METER_READING = 'DELETE_METER_READING',
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
  [DeleteAction.METER_READING]: {
    title: 'Видалити показник?',
    description:
      'Ви впевнені, що хочете видалити цей показник? Споживання наступного показника буде перераховано автоматично.',
    successMessage: 'Показник успішно видалено!',
  },
} as const;
