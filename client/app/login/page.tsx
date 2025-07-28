'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/store/auth';
import { ROUTES } from '@/routes';
import { useErrorToast } from '@/hooks/use-error-toast';
import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFForm } from '@/components/RHF/RHForm';
import { ThemeDropdown } from '@/components/ThemeDropDown/ThemeDropDown';
import { motion } from 'framer-motion';
import { loginSchema, loginDefaultValues, type LoginFormData } from '@/validation/login/login';

export default function Page() {
  const { errorToast, successToast } = useErrorToast();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log('Field changed:', name, value, type);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(data: LoginFormData) {
    try {
      const result = await login({
        username: data.username,
        password: data.password,
      }).unwrap();

      console.log('Login result:', result);

      if (result.accessToken) {
        cookies.set('accessToken', result.accessToken, {
          expires: 7,
          path: ROUTES.Home,
        });

        if (result.refreshToken) {
          cookies.set('refreshToken', result.refreshToken, {
            expires: 30,
            path: ROUTES.Home,
          });
        }

        successToast('Увійшли успішно', 'Ласкаво просимо!');

        router.push(ROUTES.ALL_APARTMENTS);
      }
    } catch (error) {
      errorToast(error);
    }
  }

  return (
    <div className="h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <Card className="w-full max-w-[600px] mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Увійти</CardTitle>
        </CardHeader>
        <CardContent>
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

            <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
              {isLoading ? 'Авторизація...' : 'Увійти'}
            </Button>
          </RHFForm>
        </CardContent>
      </Card>
      <motion.div
        className="absolute left-0 bottom-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <ThemeDropdown className="border-secondary-dark text-secondary-dark" />
      </motion.div>
    </div>
  );
}
