import cookies from 'js-cookie';

export const getAccessToken = () => cookies.get('accessToken');
export const getRefreshToken = () => cookies.get('refreshToken');

export const setTokens = (accessToken: string, refreshToken: string) => {
  cookies.set('accessToken', accessToken, { expires: 1 }); // 1 day
  cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days
};

export const clearTokens = () => {
  cookies.remove('accessToken');
  cookies.remove('refreshToken');
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } else {
      clearTokens();
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearTokens();
    return null;
  }
};
