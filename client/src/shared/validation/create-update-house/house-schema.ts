import { ApartmentType } from '@/types/core/house';
import * as yup from 'yup';

export const houseSchema = yup.object({
  apartmentName: yup
    .string()
    .trim()
    .required("Назва квартири обов'язкова")
    .max(30, 'Назва квартири не може перевищувати 30 символів'),

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
    .positive('Площа має бути більше 0'),

  purchaseDate: yup
    .date()
    .typeError('Дата покупки повинна бути дійсною датою')
    .required("Дата покупки обов'язкова"),

  price: yup
    .number()
    .transform((v, o) => (o === '' ? undefined : v))
    .required("Ціна обов'язкова")
    .positive('Ціна має бути більше 0'),

  floor: yup
    .number()
    .transform((v, o) => (o === '' ? undefined : v))
    .required("Поверх обов'язковий")
    .min(1, 'Поверх має бути не менше 1')
    .integer('Поверх має бути цілим числом'),

  street: yup.string().trim().required("Вулиця обов'язкова"),

  apartmentType: yup
    .mixed<ApartmentType>()
    .oneOf(Object.values(ApartmentType), 'Невірний тип квартири')
    .required("Тип квартири обов'язковий"),
});

export type HouseFormData = yup.InferType<typeof houseSchema>;
