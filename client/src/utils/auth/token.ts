import cookies from 'js-cookie';

export const getAccessToken = () => cookies.get('accessToken');

export const setAccessToken = (accessToken: string) => {
  cookies.set('accessToken', accessToken, {
    expires: 1,
    path: '/',
  });
};

export const clearAccessToken = () => {
  cookies.remove('accessToken');
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};
