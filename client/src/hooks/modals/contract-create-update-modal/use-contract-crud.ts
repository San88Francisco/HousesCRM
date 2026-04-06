import { CONTRACT_TERMINATION_ONGOING } from '@/shared/constants/contract-termination';
import { serializeContractForApi } from '@/shared/utils/create-update-contract-form/serialize-contract-payload';
import { ContractFormData } from '@/shared/validation/create-update-contract';
import { ContractStatus } from '@/types/core/status';
import type { UpdateContractRequest } from '@/types/services/contracts';
import { useCreateContractMutation, useUpdateContractMutation } from '@/store/api/contracts-api';

export const useContractCrud = () => {
  const [createContract, createState] = useCreateContractMutation();
  const [updateContract, updateState] = useUpdateContractMutation();

  const create = (data: ContractFormData) => {
    return createContract(serializeContractForApi(data)).unwrap();
  };

  const update = (id: string, dirtyPartial: Partial<ContractFormData>, full: ContractFormData) => {
    const body: UpdateContractRequest = { id, ...dirtyPartial };
    if (full.status === ContractStatus.ACTIVE) {
      body.termination = CONTRACT_TERMINATION_ONGOING;
    }
    return updateContract(body).unwrap();
  };

  return {
    create,
    update,
    isLoading: createState.isLoading || updateState.isLoading,
  };
};
