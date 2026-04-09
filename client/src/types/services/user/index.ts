import type { ContractPdfProfile } from '@/types/contract-pdf-profile';

export type ProfileResponse = {
  id: string;
  email: string;
  username: string;
  contractPdfProfile?: ContractPdfProfile | null;
};

export type UpdateProfileRequest = {
  email?: string;
  username?: string;
  contractPdfProfile?: ContractPdfProfile | null;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
