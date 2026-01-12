import { ContractFormData } from '@/shared/validation/create-update-contract/contract-schema';
import { useCreateContractMutation, useUpdateContractMutation } from '@/store/api/houses-api';

export const useContractCrud = () => {
  const [createContract, createState] = useCreateContractMutation();
  const [updateContract, updateState] = useUpdateContractMutation();

  const create = (data: ContractFormData) => {
    const requestData = {
      ...data,
      commencement: data.commencement.toISOString(),
      termination: data.termination.toISOString(),
    };
    return createContract(requestData).unwrap();
  };

  const update = (id: string, data: Partial<ContractFormData>) => {
    const requestData = {
      ...data,
      commencement: data.commencement?.toISOString(),
      termination: data.termination?.toISOString(),
    };
    return updateContract({ id, ...requestData }).unwrap();
  };

  return {
    create,
    update,
    isLoading: createState.isLoading || updateState.isLoading,
  };
};
