import { useEffect } from 'react';
import { useRefreshMutation } from '@/store/auth-api';
import { toast } from 'sonner';
import { tokenStorage } from '@/shared/utils/auth/token';

export const useTokenRefresh = () => {
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        try {
          const result = await refresh().unwrap();
          if (result.accessToken) {
            tokenStorage.setAccessToken(result.accessToken);
          }
        } catch (error) {
          toast.error('Помилка оновлення токена при завантаженні', {
            description: error instanceof Error ? error.message : String(error),
          });
        }
      }
    };

    checkAndRefreshToken();
  }, [refresh]);
};
