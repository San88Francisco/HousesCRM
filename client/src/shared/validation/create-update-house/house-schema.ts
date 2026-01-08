import { ApartmentType } from '@/types/core/apartment-type';
import * as yup from 'yup';

export const houseSchema = yup.object({
  apartmentName: yup
    .string()
    .trim()
    .required("Назва квартири обов'язкова")
    .max(45, 'Назва квартири не може перевищувати 45 символів'),

  roomsCount: yup
    .number()
    .required("Кількість кімнат обов'язкова")
    .min(1, 'Кількість кімнат має бути не менше 1')
    .integer('Кількість кімнат має бути цілим числом'),

  totalArea: yup
    .number()
    .required("Загальна площа обов'язкова")
    .positive('Площа має бути більше 0'),

  purchaseDate: yup
    .string()
    .required("Дата покупки обов'язкова")
    .test('min-date', 'Дата не може бути раніше 2000 року', value => {
      if (!value) return false;
      const date = new Date(value);
      return date >= new Date('2000-01-01');
    }),

  price: yup.number().required("Ціна обов'язкова").positive('Ціна має бути більше 0'),

  floor: yup
    .number()
    .required("Поверх обов'язковий")
    .min(1, 'Поверх має бути не менше 1')
    .integer('Поверх має бути цілим числом'),

  street: yup
    .string()
    .trim()
    .required("Вулиця обов'язкова")
    .max(45, 'Вулиця не може перевищувати 45 символів'),

  apartmentType: yup
    .mixed<ApartmentType>()
    .oneOf(Object.values(ApartmentType), 'Невірний тип квартири')
    .required("Тип квартири обов'язковий"),
});

export type HouseFormData = {
  apartmentName: string;
  roomsCount: number | null;
  totalArea: number | null;
  purchaseDate: string;
  price: number | null;
  floor: number | null;
  street: string;
  apartmentType: ApartmentType;
};
