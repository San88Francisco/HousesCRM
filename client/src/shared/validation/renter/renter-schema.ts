import * as yup from 'yup';

export const renterSchema = yup.object({
  firstName: yup.string().required("Ім'я обов'язкове"),
  lastName: yup.string().required("Прізвище обов'язкове"),
  age: yup
    .number()
    .required("Вік обов'язковий")
    .nullable()
    .integer('Вік має бути цілим числом')
    .min(18, 'Мінімальний вік — 18 років')
    .max(125, 'Максимальний вік — 125 років'),
});

export type RenterFormData = yup.InferType<typeof renterSchema>;
