import { ROUTES } from '@/shared/routes';
import { loginDefaultValues } from '@/shared/validation/login/defaultValues';
import { loginSchema } from '@/shared/validation/login/login';
import { useLoginMutation } from '@/store/api/auth-api';
import { LoginRequest } from '@/types/services/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useLogin = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.success('Увійшли успішно');
      router.push(ROUTES.ALL_HOUSES);
    } catch {
      toast.error('Невірні облікові дані або помилка авторизації');
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};
