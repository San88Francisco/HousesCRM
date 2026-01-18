import { ContractStatus } from '@/types/core/status/status';
import { getStatusLabel } from './status-labels';

export const statusOptions = [
  { value: ContractStatus.ACTIVE, label: getStatusLabel(ContractStatus.ACTIVE), disabled: false },
  {
    value: ContractStatus.INACTIVE,
    label: getStatusLabel(ContractStatus.INACTIVE),
    disabled: false,
  },
];
