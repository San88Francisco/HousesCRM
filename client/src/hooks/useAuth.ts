import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { clearTokens, getAccessToken, getRefreshToken } from '@/utils/auth/refreshToken';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (accessToken || refreshToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
    router.push('/login');
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
  };
};
