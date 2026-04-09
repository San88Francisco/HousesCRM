import * as yup from 'yup';

export const updateProfileSchema = yup.object({
  email: yup
    .string()
    .required("Електронна пошта є обов'язковою.")
    .email('Некоректний формат електронної пошти.'),
  username: yup
    .string()
    .required("Ім'я користувача є обов'язковим.")
    .min(3, "Ім'я користувача має містити щонайменше 3 символи."),
});

export type UpdateProfileFormValues = yup.InferType<typeof updateProfileSchema>;
