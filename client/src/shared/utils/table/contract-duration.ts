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

  const [start, end] = startDate > endDate ? [endDate, startDate] : [startDate, endDate];

  const months = differenceInMonths(end, start);
  if (months > 0) {
    return `${months} міс`;
  }

  const weeks = differenceInWeeks(end, start);
  if (weeks > 0) {
    return `${weeks} тиж.`;
  }

  const days = differenceInDays(end, start);
  return `${days} дн.`;
};
