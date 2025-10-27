'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLoginMutation } from '@/store/auth';
import { ROUTES } from '@/routes';
import { useErrorToast } from '@/hooks/use-error-toast';

import { RHFForm } from '@/components/RHF/RHForm';
import { loginSchema, loginDefaultValues } from '@/validation/login/login';
import { LoginRequest } from '@/types/services/login';
import { RHFInput } from '@/components/RHF/RHFInput';
import { GoogleLoginButton } from '@/components/GoogleAuthButton';
import { setAccessToken } from '@/utils/auth/token';

export default function Page() {
  const { errorToast, successToast } = useErrorToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginRequest) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      if (result.accessToken) {
        setAccessToken(result.accessToken);

        successToast('Увійшли успішно', 'Ласкаво просимо!');

        const redirectUrl = searchParams.get('redirect') || ROUTES.ALL_APARTMENTS;
        router.push(redirectUrl);
      }
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <div className="h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
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
          <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
            {isLoading ? 'Авторизація...' : 'Увійти'}
          </Button>
          <GoogleLoginButton />
        </RHFForm>
      </div>
    </div>
  );
}
