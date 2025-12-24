import * as yup from 'yup';

export const renterSchema = yup.object({
  firstName: yup.string().required("Ім'я обов'язкове"),
  lastName: yup.string().required("Прізвище обов'язкове"),

  occupied: yup.date().required("Дата заселення обов'язкова"),

  vacated: yup
    .date()
    .required("Дата виселення обов'язкова")
    .test('is-after', 'Дата виселення має бути пізніше дати заселення', (value, context) => {
      const { occupied } = context.parent;
      return !value || !occupied || new Date(value) > new Date(occupied);
    }),
});

export type RenterFormData = yup.InferType<typeof renterSchema>;
