import { ContractFormData } from '@/shared/validation/create-update-contract/contract-schema';
import { ContractStatus } from '@/types/core/status/status';
import { startOfToday } from 'date-fns';

export const defaultContractValues: ContractFormData = {
  commencement: startOfToday(),
  termination: startOfToday(),
  status: ContractStatus.ACTIVE,
  monthlyPayment: null as unknown as number,
  houseId: '',
  renterId: '',
};
