import { ContractStatus } from '@/types/core/status/status';

export type ContractFormFields = {
  commencement: string;
  termination: string;
  status: ContractStatus;
  monthlyPayment: number;
  houseId: string;
  renterId: string;
};
