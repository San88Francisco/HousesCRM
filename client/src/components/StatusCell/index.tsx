import { STATUS_COLOR } from '@/constants/table/statusColor';
import { cn } from '@/lib/utils';
import { Status } from '@/types/core/status';

type StatusCellProps = {
  status: Status;
};

export const StatusCell = ({ status }: StatusCellProps) => {
  return (
    <div
      className={cn(
        'relative flex items-center justify-end capitalize font-medium',
        STATUS_COLOR[status],
      )}
    >
      {status}
    </div>
  );
};
