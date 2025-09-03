import { getStatusColor } from '@/utils/table/getStatusColor';

type StatusCellProps = {
  status: string;
};

export const StatusCell = ({ status }: StatusCellProps) => {
  return (
    <div
      className={`relative flex items-center justify-end capitalize font-medium  ${getStatusColor(status)}`}
    >
      {status}
    </div>
  );
};
