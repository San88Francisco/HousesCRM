'use client';

import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFForm } from '@/components/RHF/RHForm';
import { Button } from '@/shared/ui/button';
import { CardTitle } from '@/shared/ui/card';
import { GoogleLoginButton } from '../google-auth-button';
import { useLogin } from '@/hooks/use-login';

export const LoginForm = () => {
  const { form, onSubmit, isLoading } = useLogin();

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <CardTitle className="text-2xl font-bold mb-4">Увійти</CardTitle>
      <RHFForm form={form} onSubmit={onSubmit}>
        <RHFInput
          name="email"
          label="Електронна пошта"
          type="email"
          placeholder="Введіть вашу електронну пошту"
          required
        />
        <RHFInput
          name="password"
          label="Пароль"
          type="password"
          placeholder="Введіть ваш пароль"
          required
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Авторизація...' : 'Увійти'}
        </Button>
        <GoogleLoginButton />
      </RHFForm>
    </div>
  );
};
