const TOKEN_KEY = 'mokamtola_admin_token';

export const authStorage = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isLoggedIn: () => {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};