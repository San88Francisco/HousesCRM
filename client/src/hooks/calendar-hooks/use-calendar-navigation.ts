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
    const firtsDayNextMonth = add(firstDayCurrentMonth, { months: MONTHS_PAGE_STEP });
    setCurrentMonth(format(firtsDayNextMonth, 'MMM-yyyy'));
  };

  const prevMonth = () => {
    const firtsDayNextMonth = add(firstDayCurrentMonth, { months: -MONTHS_PAGE_STEP });
    setCurrentMonth(format(firtsDayNextMonth, 'MMM-yyyy'));
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
    if (level === 'days') {
      nextMonth();
    }
    if (level === 'months') {
      nextYear();
    }
    if (level === 'years') {
      nextDecade();
    }
  };

  const handlePrevPage = () => {
    if (level === 'days') {
      prevMonth();
    }
    if (level === 'months') {
      prevYear();
    }
    if (level === 'years') {
      prevDecade();
    }
  };

  return {
    handleNextPage,
    handlePrevPage,
  };
};
