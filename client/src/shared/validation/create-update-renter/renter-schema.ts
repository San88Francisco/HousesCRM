import * as yup from 'yup';

export const renterSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required("Ім'я обов'язкове")
    .min(2, "Ім'я має містити щонайменше 2 символи")
    .max(15, "Ім'я має містити не більше 15 символів"),
  lastName: yup
    .string()
    .trim()
    .required("Прізвище обов'язкове")
    .min(2, 'Прізвище має містити щонайменше 2 символи')
    .max(30, 'Прізвище має містити не більше 30 символів'),
  age: yup
    .number()
    .required("Вік обов'язковий")
    .integer('Вік має бути цілим числом')
    .min(18, 'Мінімальний вік — 18 років')
    .max(100, 'Максимальний вік — 100 років'),
});

export type RenterFormData = yup.InferType<typeof renterSchema>;
