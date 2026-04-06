import { CONTRACT_TERMINATION_ONGOING } from '@/shared/constants/contract-termination';
import { ContractFormData } from '@/shared/validation/create-update-contract';
import { ContractStatus } from '@/types/core/status';
import type { CreateContractRequest } from '@/types/services/contracts';

export const serializeContractForApi = (data: ContractFormData): CreateContractRequest => ({
  ...data,
  termination:
    data.status === ContractStatus.ACTIVE
      ? CONTRACT_TERMINATION_ONGOING
      : (data.termination as Date),
});
