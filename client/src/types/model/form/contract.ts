import { ContractStatus } from '@/types/core/status/status';

export type ContractFormFields = {
  commencement: Date | null;
  termination: Date | null;
  status: ContractStatus;
  monthlyPayment: number | null;
  houseId: string;
  renterId: string;
};
