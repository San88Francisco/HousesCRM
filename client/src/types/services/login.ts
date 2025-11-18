export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: string;
  email: string;
  username: string;
  accessToken: string;
};

export type RefreshResponse = {
  accessToken: string;
};
