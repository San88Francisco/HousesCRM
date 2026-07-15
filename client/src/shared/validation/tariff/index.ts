import * as yup from 'yup';

export const tariffSchema = yup.object({
  pricePerUnit: yup
    .number()
    .typeError('Ціна має бути числом')
    .required("Ціна обов'язкова")
    .positive('Ціна має бути більше 0'),

  validFrom: yup.string().required("Дата початку дії обов'язкова"),
});

export type TariffFormData = {
  pricePerUnit: number | null;
  validFrom: string;
};
