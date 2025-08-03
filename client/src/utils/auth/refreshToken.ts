import cookies from 'js-cookie';

export const getAccessToken = () => cookies.get('accessToken');
export const getRefreshToken = () => cookies.get('refreshToken');

export const setTokens = (accessToken: string, refreshToken: string) => {
  // Встановлюємо токени з правильними налаштуваннями
  cookies.set('accessToken', accessToken, {
    expires: 1, // 1 день
    path: '/', // Важливо: доступний для всього сайту
    secure: process.env.NODE_ENV === 'production', // HTTPS тільки в продакшені
    sameSite: 'strict',
  });

  cookies.set('refreshToken', refreshToken, {
    expires: 7, // 7 днів
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const clearTokens = () => {
  cookies.remove('accessToken', { path: '/' });
  cookies.remove('refreshToken', { path: '/' });
};

// Функція для перевірки чи токен скоро закінчиться (опціонально)
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Конвертуємо в мілісекунди
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;

    // Повертаємо true якщо токен закінчиться через менше ніж 5 хвилин
    return timeUntilExpiry < 5 * 60 * 1000;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Якщо не можемо розпарсити, вважаємо що потрібно оновити
  }
};

// Основна функція для refresh (залишаємо для сумісності, але тепер RTK Query буде використовувати свою логіку)
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch('http://localhost:5000/auth/refresh-token', {
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
