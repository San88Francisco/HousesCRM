import * as yup from 'yup';

export type LoginFormData = {
  username: string;
  password: string;
};

export const loginSchema = yup.object({
  username: yup.string().required("Електронна пошта є обов'язковою."),
  password: yup.string().required("Пароль є обов'язковим."),
});

export const loginDefaultValues: LoginFormData = {
  username: '',
  password: '',
};
