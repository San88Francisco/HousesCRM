import * as yup from 'yup';

export const apartmentSchema = yup.object({
  apartmentName: yup.string().required("Назва квартири обов'язкова"),
  roomsCount: yup
    .number()
    .required("Кількість кімнат обов'язкова")
    .positive('Кількість кімнат має бути більше 0')
    .integer('Кількість кімнат має бути цілим числом'),
  totalArea: yup
    .number()
    .required("Загальна площа обов'язкова")
    .positive('Площа має бути більше 0'),
  purchaseDate: yup
    .date()
    .max(new Date(), 'Дата не може бути з майбутнього')
    .required("Дата покупки обов'язкова"),
  price: yup.number().required("Ціна обов'язкова").positive('Ціна має бути більше 0'),
  floor: yup.number().required("Поверх обов'язковий").integer('Поверх має бути цілим числом'),
  street: yup.string().required("Вулиця обов'язкова"),
  apartmentType: yup
    .string()
    .oneOf(['new_build', 'old_build'], 'Невірний тип квартири')
    .required("Тип квартири обов'язковий"),
  contractIds: yup.array().of(yup.string().required()).default([]),
});

export type ApartmentFormData = yup.InferType<typeof apartmentSchema>;
