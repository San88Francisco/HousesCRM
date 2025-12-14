import * as yup from 'yup';

export const apartmentSchema = yup.object({
  apartmentName: yup.string().required("Назва квартири обов'язкова"),
  roomsCount: yup
    .number()
    .transform((v, o) => (o === '' ? undefined : v))
    .required("Кількість кімнат обов'язкова")
    .positive('Кількість кімнат має бути більше 0')
    .integer('Кількість кімнат має бути цілим числом'),
  totalArea: yup
    .number()
    .transform((v, o) => (o === '' ? undefined : v))
    .required("Загальна площа обов'язкова")
    .positive('Площа має бути більше 0'),
  purchaseDate: yup.date().required("Дата покупки обов'язкова"),
  price: yup
    .number()
    .transform((v, o) => (o === '' ? undefined : v))
    .required("Ціна обов'язкова")
    .positive('Ціна має бути більше 0'),
  floor: yup
    .number()
    .transform((v, o) => (o === '' ? undefined : v))
    .required("Поверх обов'язковий")
    .integer('Поверх має бути цілим числом'),
  street: yup.string().required("Вулиця обов'язкова"),
  apartmentType: yup
    .string()
    .oneOf(['new_build', 'resale'], 'Невірний тип квартири')
    .required("Тип квартири обов'язковий"),
  // TODO Для створення помилки та відслідковування поведінки UI компонентів на помилку.
  // contractIds: yup.array().of(yup.string().required()).default([]),
});

export type ApartmentFormData = yup.InferType<typeof apartmentSchema>;
