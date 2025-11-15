import { CalendarMode, levelType } from '@/types/core/calendar';

export const levelMap: Record<CalendarMode, levelType> = {
  years: 'years',
  yearsMonths: 'months',
  yearsMonthsDays: 'days',
};

export const nextLevelMap: Record<CalendarMode, Partial<Record<levelType, levelType>>> = {
  years: {},
  yearsMonths: { years: 'months' },
  yearsMonthsDays: { years: 'months', months: 'days' },
};
