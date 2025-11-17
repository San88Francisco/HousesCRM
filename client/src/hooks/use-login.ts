import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { useLoginMutation } from '@/store/auth';
import { LoginRequest } from '@/types/services/login';
import { loginSchema } from '@/shared/validation/login/login';
import { ROUTES } from '@/shared/routes';
import { loginDefaultValues } from '@/shared/validation/login/defaultValues';
import { tokenStorage } from '@/shared/utils/auth/token';

export const useLogin = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      if (result.accessToken) {
        tokenStorage.setAccessToken(result.accessToken);
        toast.success('Увійшли успішно');
        router.push(ROUTES.ALL_APARTMENTS);
      }
    } catch (error: unknown) {
      toast.error(`Невірні облікові дані або помилка авторизації: ${error}`);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};
