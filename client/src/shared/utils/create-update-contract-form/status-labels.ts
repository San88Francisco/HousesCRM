import { ContractStatus } from '@/types/core/status/status';

export const getStatusLabel = (status: ContractStatus) => {
  return status === ContractStatus.ACTIVE ? 'Активний' : 'Неактивний';
};
