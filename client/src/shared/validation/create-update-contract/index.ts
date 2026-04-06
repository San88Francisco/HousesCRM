import { ContractStatus } from '@/types/core/status';
import * as yup from 'yup';

export const contractSchema = yup.object({
  commencement: yup.date().required("Дата початку обов'язкова").typeError('Невірний формат дати'),

  termination: yup
    .date()
    .nullable()
    .when('status', {
      is: ContractStatus.INACTIVE,
      then: schema =>
        schema
          .required("Дата завершення обов'язкова")
          .typeError('Невірний формат дати')
          .min(yup.ref('commencement'), 'Дата завершення не може бути раніше дати початку'),
      otherwise: schema => schema.nullable(),
    }),

  status: yup
    .mixed<ContractStatus>()
    .oneOf(Object.values(ContractStatus), 'Невірний статус контракту')
    .required("Статус обов'язковий"),

  monthlyPayment: yup
    .number()
    .required("Щомісячна оплата обов'язкова")
    .positive('Щомісячна оплата має бути додатним числом')
    .min(1, 'Мінімальна щомісячна оплата — 1')
    .max(1000000, 'Максимальна щомісячна оплата — 1,000,000'),

  houseId: yup.string().required("Будинок обов'язковий").uuid('Невірний формат ID будинку'),

  renterId: yup.string().required("Орендар обов'язковий").uuid('Невірний формат ID орендаря'),
});

export type ContractFormData = {
  commencement: Date | null;
  termination: Date | null;
  status: ContractStatus;
  monthlyPayment: number | null;
  houseId: string;
  renterId: string;
};
