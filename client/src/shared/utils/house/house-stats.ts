import { addDays, differenceInDays, intervalToDuration } from 'date-fns';

import { HouseOccupancyItem } from '@/types/model/houses-occupancy';
import { OccupancyBase } from '@/types/services/houses';

import { breakBetweenContracts } from './break-between-contracts';

export const computeHouseStats = (data: HouseOccupancyItem[]) => {
  const totalIncome = data.reduce((sum, item) => sum + (item.totalIncome || 0), 0);

  const rentalDays = data.reduce((sum, item) => {
    if (!item.occupied) return sum;
    const start = new Date(item.occupied);
    const end = item.vacated ? new Date(item.vacated) : new Date();
    return sum + Math.max(0, differenceInDays(end, start));
  }, 0);

  const dataWithBreaks = breakBetweenContracts(data as OccupancyBase[]);
  const idleDays = dataWithBreaks
    .filter(item => item.isVacancy)
    .reduce((sum, item) => {
      if (!item.occupied || !item.vacated) return sum;
      const start = new Date(item.occupied);
      const end = new Date(item.vacated);
      return sum + Math.max(0, differenceInDays(end, start));
    }, 0);

  return { totalIncome, rentalDays, idleDays };
};

export const formatTotalDays = (totalDays: number): string => {
  if (totalDays <= 0) return '0 дн.';

  const start = new Date(2000, 0, 1);
  const end = addDays(start, totalDays);
  const { years = 0, months = 0, days = 0 } = intervalToDuration({ start, end });

  if (years > 0) {
    return [`${years} р.`, months > 0 ? `${months} міс.` : ''].filter(Boolean).join(' ');
  }

  if (months > 0) {
    const weeks = Math.floor(days / 7);
    return [`${months} міс.`, weeks > 0 ? `${weeks} тиж.` : ''].filter(Boolean).join(' ');
  }

  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return [`${weeks} тиж.`, remainingDays > 0 ? `${remainingDays} дн.` : '']
      .filter(Boolean)
      .join(' ');
  }

  return `${days} дн.`;
};
