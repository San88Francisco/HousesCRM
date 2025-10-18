export type levelType = 'days' | 'months' | 'years';

export interface DateRange {
  from: Date;
  to: Date;
}

export enum CalendarMode {
  Years = 'years',
  YearsMonths = 'yearsMonths',
  YearsMonthsDays = 'yearsMonthsDays',
}
