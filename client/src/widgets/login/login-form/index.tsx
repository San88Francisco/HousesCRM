'use client';

import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFForm } from '@/components/RHF/RHForm';
import { useLogin } from '@/hooks/use-login';
import { Button } from '@/shared/ui/button';
import { GoogleLoginButton } from '../google-auth-button';
export const LoginForm = () => {
  const { form, onSubmit, isLoading } = useLogin();

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-2xl font-bold mb-4">Увійти</h1>

      <RHFForm form={form} onSubmit={onSubmit} className="space-y-4">
        <RHFInput
          name="email"
          label="Електронна пошта"
          type="email"
          placeholder="Введіть вашу електронну пошту"
          autoComplete="email"
        />
        <RHFInput
          name="password"
          label="Пароль"
          type="password"
          placeholder="Введіть ваш пароль"
          autoComplete="current-password"
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Авторизація...' : 'Увійти'}
        </Button>

        <GoogleLoginButton />
      </RHFForm>
    </div>
  );
};
