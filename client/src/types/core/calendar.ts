export type levelType = 'days' | 'months' | 'years';

export interface DateRange {
  from: Date;
  to: Date;
}

export type CalendarMode = 'year' | 'yearMonth' | 'yearMonthDay';

export const levelMap: Record<CalendarMode, levelType> = {
  year: 'years',
  yearMonth: 'months',
  yearMonthDay: 'days',
};
