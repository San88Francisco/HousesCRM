'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/store/auth';
import { RHFForm } from '@/components/RHF/RHForm';
import { LoginRequest } from '@/types/services/login';
import { RHFInput } from '@/components/RHF/RHFInput';
import { GoogleLoginButton } from '@/widgets/Login/GoogleAuthButton';
import { loginDefaultValues, loginSchema } from '@/shared/validation/login/login';
import { ROUTES } from '@/shared/routes';
import { toast } from 'sonner';
import { CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export default function Page() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginRequest) => {
    try {
      const result = await login({
        username: data.username,
        password: data.password,
      }).unwrap();

      if (result.accessToken) {
        cookies.set('accessToken', result.accessToken, {
          expires: 7,
          path: ROUTES.HOME,
        });

        if (result.refreshToken) {
          cookies.set('refreshToken', result.refreshToken, {
            expires: 30,
            path: ROUTES.HOME,
          });
        }

        toast.success('Увійшли успішно');
        router.push(ROUTES.ALL_APARTMENTS);
      }
    } catch (error) {
      console.error('✌️error --->', error);
      toast.error('Помилка під час входу');
    }
  };

  return (
    <div className="h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-[400px] mx-auto">
        <CardTitle className="text-2xl font-bold mb-4">Увійти</CardTitle>
        <RHFForm form={form} onSubmit={onSubmit}>
          <RHFInput
            name="username"
            label="Електронна пошта"
            type="username"
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
          <Button type="submit" className="w-full " disabled={isSubmitting || isLoading}>
            {isLoading ? 'Авторизація...' : 'Увійти'}
          </Button>
          <GoogleLoginButton />
        </RHFForm>
      </div>
    </div>
  );
}
