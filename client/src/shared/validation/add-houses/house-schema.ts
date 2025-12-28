import { ApartmentType } from '@/types/core/houses';
import * as yup from 'yup';

export const apartmentSchema = yup.object({
  apartmentName: yup.string().required("Назва квартири обов'язкова"),

  roomsCount: yup
    .number()
    .transform((v, o) => (o === '' ? undefined : v))
    .required("Кількість кімнат обов'язкова")
    .min(1, 'Кількість кімнат має бути не менше 1')
    .integer('Кількість кімнат має бути цілим числом'),

  totalArea: yup
    .number()
    .transform((v, o) => (o === '' ? undefined : v))
    .required("Загальна площа обов'язкова")
    .min(1, 'Площа має бути не менше 1 м²'),

  purchaseDate: yup.date().required("Дата покупки обов'язкова"),

  price: yup
    .number()
    .transform((v, o) => (o === '' ? undefined : v))
    .required("Ціна обов'язкова")
    .min(1, 'Ціна має бути не менше 1 грн'),

  floor: yup
    .number()
    .transform((v, o) => (o === '' ? undefined : v))
    .required("Поверх обов'язковий")
    .min(0, "Поверх не може бути від'ємним")
    .integer('Поверх має бути цілим числом')
    .test('no-negative-zero', "Поверх не може бути від'ємним", value => {
      return value === undefined || !Object.is(value, -0);
    }),

  street: yup.string().required("Вулиця обов'язкова"),

  apartmentType: yup
    .mixed<ApartmentType>()
    .oneOf(Object.values(ApartmentType), 'Невірний тип квартири')
    .required("Тип квартири обов'язковий"),
});

export type ApartmentFormData = yup.InferType<typeof apartmentSchema>;
