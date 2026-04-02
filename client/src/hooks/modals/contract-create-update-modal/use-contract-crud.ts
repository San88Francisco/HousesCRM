import { ContractFormData } from '@/shared/validation/create-update-contract';
import { useCreateContractMutation, useUpdateContractMutation } from '@/store/api/contracts-api';

export const useContractCrud = () => {
  const [createContract, createState] = useCreateContractMutation();
  const [updateContract, updateState] = useUpdateContractMutation();

  const create = (data: ContractFormData) => {
    return createContract(data).unwrap();
  };

  const update = (id: string, data: Partial<ContractFormData>) => {
    return updateContract({ id, ...data }).unwrap();
  };

  return {
    create,
    update,
    isLoading: createState.isLoading || updateState.isLoading,
  };
};
