import { cn } from '@/shared/utils/cn';
import { getStatusLabel } from '@/shared/utils/create-update-contract-form/status-labels';
import { ContractStatus } from '@/types/core/status';

type ContractStatusLabelProps = {
  status: ContractStatus;
  className?: string;
};

export const ContractStatusLabel = ({ status, className }: ContractStatusLabelProps) => {
  return (
    <span
      className={cn(status === ContractStatus.ACTIVE ? 'text-yellow' : 'text-purple', className)}
    >
      {getStatusLabel(status)}
    </span>
  );
};
