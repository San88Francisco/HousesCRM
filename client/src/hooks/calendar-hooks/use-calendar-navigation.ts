'use client';
import { LevelType } from '@/types/core/calendar/calendar';
import { add, addYears, format } from 'date-fns';

const DECADE_PAGE_STEP = 10;
const MONTHS_PAGE_STEP = 1;
const YEARS_PAGE_STEP = 1;

type useCalendarNavigationProps = {
  level: LevelType;
  firstDayCurrentMonth: Date;
  currentDecadeStart: Date;
  currentYear: Date;
  setCurrentMonth: (currentMonth: string) => void;
  setCurrentYear: (date: Date) => void;
  setCurrentDecadeStart: (currentDecadeStart: Date) => void;
};

export const useCalendarNavigation = ({
  level,
  firstDayCurrentMonth,
  currentDecadeStart,
  currentYear,
  setCurrentMonth,
  setCurrentYear,
  setCurrentDecadeStart,
}: useCalendarNavigationProps) => {
  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: MONTHS_PAGE_STEP });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  };

  const prevMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -MONTHS_PAGE_STEP });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  };

  const nextYear = () => {
    setCurrentYear(addYears(currentYear, YEARS_PAGE_STEP));
  };

  const prevYear = () => {
    setCurrentYear(addYears(currentYear, -YEARS_PAGE_STEP));
  };

  const nextDecade = () => {
    setCurrentDecadeStart(addYears(currentDecadeStart, DECADE_PAGE_STEP));
  };

  const prevDecade = () => {
    setCurrentDecadeStart(addYears(currentDecadeStart, -DECADE_PAGE_STEP));
  };

  const handleNextPage = () => {
    switch (level) {
      case 'days':
        nextMonth();
        break;
      case 'months':
        nextYear();
        break;
      case 'years':
        nextDecade();
        break;
    }
  };

  const handlePrevPage = () => {
    switch (level) {
      case 'days':
        prevMonth();
        break;
      case 'months':
        prevYear();
        break;
      case 'years':
        prevDecade();
        break;
    }
  };

  return {
    handleNextPage,
    handlePrevPage,
  };
};
