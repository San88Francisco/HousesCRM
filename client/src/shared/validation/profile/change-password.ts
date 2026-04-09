import * as yup from 'yup';

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Поточний пароль є обов'язковим."),
  newPassword: yup
    .string()
    .required("Новий пароль є обов'язковим.")
    .min(6, 'Новий пароль має містити щонайменше 6 символів.'),
  confirmNewPassword: yup
    .string()
    .required('Підтвердіть новий пароль.')
    .oneOf([yup.ref('newPassword')], 'Паролі не збігаються'),
});

export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;
