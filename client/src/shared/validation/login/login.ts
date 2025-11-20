import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().required("Електронна пошта є обов'язковою."),
  password: yup.string().required("Пароль є обов'язковим."),
});
