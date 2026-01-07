import { differenceInDays, differenceInMonths, differenceInWeeks } from 'date-fns';

export const contractDuration = (occupied: string, vacated: string) => {
  if (!occupied) {
    return '0 дн.';
  }

  const startDate = new Date(occupied);
  const endDate = vacated ? new Date(vacated) : new Date();

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return '0 дн.';
  }

  const months = differenceInMonths(endDate, startDate);
  if (months > 0) {
    return `${months} міс`;
  }

  const weeks = differenceInWeeks(endDate, startDate);
  if (weeks > 0) {
    return `${weeks} тиж.`;
  }

  const days = differenceInDays(endDate, startDate);
  return `${days} дн.`;
};
