import { ContractFormData } from '@/shared/validation/create-update-contract/contract-schema';
import { ContractCreateUpdate } from '@/types/core/contract';

export const mapContractToFormData = (contract: ContractCreateUpdate): ContractFormData => {
  return {
    commencement: new Date(contract.commencement),
    termination: new Date(contract.termination),
    status: contract.status,
    monthlyPayment: contract.monthlyPayment,
    houseId: contract.house?.id || '',
    renterId: contract.renter?.id || '',
  };
};
