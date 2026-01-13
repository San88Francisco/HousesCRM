import { ContractFormData } from '@/shared/validation/create-update-contract/contract-schema';
import { ContractStatus } from '@/types/core/status/status';

export const defaultContractValues: ContractFormData = {
  commencement: null,
  termination: null,
  status: ContractStatus.ACTIVE,
  monthlyPayment: null,
  houseId: '',
  renterId: '',
};
