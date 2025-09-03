export const getStatusColor = (status: string) => {
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
