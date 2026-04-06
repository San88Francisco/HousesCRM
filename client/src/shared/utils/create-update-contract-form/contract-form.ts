import { ContractFormData } from '@/shared/validation/create-update-contract';
import { ContractCreateUpdate } from '@/types/core/contract';

export const mapContractToFormData = (contract: ContractCreateUpdate): ContractFormData => {
  return {
    commencement: new Date(contract.commencement),
    termination: contract.termination ? new Date(contract.termination) : null,
    status: contract.status,
    monthlyPayment: contract.monthlyPayment,
    houseId: contract.house?.id || '',
    renterId: contract.renter?.id || '',
  };
};
