import { ContractStatus } from '@/types/core/status';

export const getStatusLabel = (status: ContractStatus) => {
  return status === ContractStatus.ACTIVE ? 'Активний' : 'Не активний';
};
