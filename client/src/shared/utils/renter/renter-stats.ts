import { differenceInDays } from 'date-fns';

import { ContractWithRevenue } from '@/types/core/contract';

export const computeRenterLivedDays = (
  contracts: ContractWithRevenue[],
  fallbackOccupied: string,
  fallbackVacated: string,
): number => {
  if (contracts.length > 0) {
    return contracts.reduce((sum, c) => {
      const start = new Date(c.commencement);
      const end = c.termination ? new Date(c.termination) : new Date();
      return sum + Math.max(0, differenceInDays(end, start));
    }, 0);
  }

  if (!fallbackOccupied) return 0;
  const start = new Date(fallbackOccupied);
  const end = fallbackVacated ? new Date(fallbackVacated) : new Date();
  return Math.max(0, differenceInDays(end, start));
};
