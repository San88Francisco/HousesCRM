import Cookies from 'js-cookie';

export const tokenStorage = {
  setAccessToken: (token: string) => {
    Cookies.set('access_token', token, {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  },

  getAccessToken: () => {
    return Cookies.get('access_token');
  },

  clearTokens: () => {
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('user_data', { path: '/' });
  },

  setUserData: (user: { email: string; username?: string }) => {
    Cookies.set('user_data', JSON.stringify(user), {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  },

  getUserData: () => {
    const rawCookie = Cookies.get('user_data');
    if (!rawCookie) {
      return null;
    }
    const parsed = JSON.parse(rawCookie);
    return parsed;
  },
};
