import { intervalToDuration } from 'date-fns';

export const contractDuration = (occupied: string, vacated: string | null | undefined) => {
  if (!occupied) {
    return '0 дн.';
  }

  const startDate = new Date(occupied);
  const endDate = vacated ? new Date(vacated) : new Date();

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return '0 дн.';
  }

  const [start, end] = startDate > endDate ? [endDate, startDate] : [startDate, endDate];

  const duration = intervalToDuration({ start, end });
  const { years = 0, months = 0, days = 0 } = duration;

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
