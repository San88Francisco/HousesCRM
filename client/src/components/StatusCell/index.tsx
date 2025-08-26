import React from 'react';

interface StatusCellProps {
  status: string;
}

export function StatusCell({ status }: StatusCellProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-yellow';
      case 'failed':
        return 'text-dark-medium';
      case 'processing':
        return 'text-purple';
      case 'pending':
        return 'text-blue';
      default:
        return 'text-dark-medium';
    }
  };

  return (
    <div
      className={`relative flex items-center justify-end capitalize font-medium  ${getStatusColor(status)}`}
    >
      {status}
    </div>
  );
}
