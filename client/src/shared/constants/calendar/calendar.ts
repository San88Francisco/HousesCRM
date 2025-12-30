import { CalendarMode, LevelType } from '@/types/core/calendar/calendar';

export const levelMap: Record<CalendarMode, LevelType> = {
  years: 'years',
  yearsMonths: 'months',
  yearsMonthsDays: 'days',
};

export const nextLevelMap: Record<CalendarMode, Partial<Record<LevelType, LevelType>>> = {
  years: {},
  yearsMonths: { years: 'months' },
  yearsMonthsDays: { years: 'months', months: 'days' },
};
