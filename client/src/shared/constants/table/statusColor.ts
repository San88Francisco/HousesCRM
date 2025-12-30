import { Status } from '@/types/core/status/status';

export const STATUS_COLOR: Record<Status, string> = {
  [Status.SUCCESS]: 'text-yellow',
  [Status.FAILED]: 'text-dark-medium',
  [Status.PROCESSING]: 'text-purple',
  [Status.PENDING]: 'text-blue',
  [Status.DEFAULT]: 'text-dark-medium',
};
