import { ContractFormData } from '@/shared/validation/create-update-contract';
import { ContractStatus } from '@/types/core/status';

export const defaultContractValues: ContractFormData = {
  commencement: null,
  termination: null,
  status: ContractStatus.ACTIVE,
  monthlyPayment: null,
  houseId: '',
  renterId: '',
};
