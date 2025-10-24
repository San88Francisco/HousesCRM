import cookies from 'js-cookie';

// Отримати access token
export const getAccessToken = () => cookies.get('accessToken');

// Встановити access token (refresh token встановлює бекенд)
export const setAccessToken = (accessToken: string) => {
  cookies.set('accessToken', accessToken, {
    expires: 1, // 1 день
    path: '/',
  });
};

// Очистити access token (refresh token очистить бекенд при logout)
export const clearAccessToken = () => {
  cookies.remove('accessToken');
};

// Перевірка чи користувач авторизований
export const isAuthenticated = () => {
  return !!getAccessToken();
};
