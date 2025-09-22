export type viewModeType = 'days' | 'months' | 'years';

export enum CalendarMode {
  Single = 'single',
  Range = 'range',
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}
