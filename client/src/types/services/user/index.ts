export type ProfileResponse = {
  id: string;
  email: string;
  username: string;
};

export type UpdateProfileRequest = {
  email?: string;
  username?: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
