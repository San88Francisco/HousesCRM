import cookies from 'js-cookie';

export const getAccessToken = () => cookies.get('access_token');

export const setAccessToken = (accessToken: string) => {
  cookies.set('access_token', accessToken, {
    expires: 1,
    path: '/',
  });
};

export const clearAccessToken = () => {
  cookies.remove('access_token');
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};
