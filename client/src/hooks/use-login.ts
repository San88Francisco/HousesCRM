import { rootApi } from '@/shared/api';
import { ROUTES } from '@/shared/routes';
import { tokenStorage } from '@/shared/utils/auth';
import { loginDefaultValues } from '@/shared/validation/login/defaultValues';
import { loginSchema } from '@/shared/validation/login/login';
import { useLoginMutation } from '@/store/api/auth-api';
import { setUser } from '@/store/slice/user-slice';
import { LoginRequest } from '@/types/services/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const resolver = useMemo(() => yupResolver(loginSchema), []);

  const form = useForm<LoginRequest>({
    resolver,
    defaultValues: loginDefaultValues,
  });

  const onSubmit = useCallback(
    async (data: LoginRequest) => {
      try {
        const res = await login({
          email: data.email,
          password: data.password,
        }).unwrap();

        if (res.accessToken) {
          tokenStorage.setAccessToken(res.accessToken);
          dispatch(rootApi.util.resetApiState());
        }
        if (res.email) {
          const userData = { email: res.email, username: res.username };
          tokenStorage.setUserData(userData);
          dispatch(setUser(userData));
        }

        toast.success('Увійшли успішно');
        router.push(ROUTES.ALL_HOUSES);
      } catch {
        toast.error('Невірні облікові дані або помилка авторизації');
      }
    },
    [dispatch, login, router],
  );

  return {
    form,
    onSubmit,
    isLoading,
  };
};
