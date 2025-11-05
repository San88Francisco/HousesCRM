import Cookies from 'js-cookie';

export const tokenStorage = {
  setAccessToken: (token: string) => {
    Cookies.set('access_token', token);
  },

  getAccessToken: () => {
    return Cookies.get('access_token');
  },

  clearTokens: () => {
    Cookies.remove('access_token');
  },
};
