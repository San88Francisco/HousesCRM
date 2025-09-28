'use client';
import { viewModeType } from '@/types/core/calendar';
import { add, addYears, format } from 'date-fns';

const DECADE_PAGE_STEP = 10;
const MONTHS_PAGE_STEP = 1;
const YEARS_PAGE_STEP = 1;

type useCalendarNavigationProps = {
  viewMode: viewModeType;
  firstDayCurrentMonth: Date;
  currentDecadeStart: Date;
  currentYear: Date;
  setCurrentMonth: (currentMonth: string) => void;
  setCurrentYear: (date: Date) => void;
  setCurrentDecadeStart: (currentDecadeStart: Date) => void;
};

export const useCalendarNavigation = ({
  viewMode,
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
    if (viewMode === 'days') {
      nextMonth();
    }
    if (viewMode === 'months') {
      nextYear();
    }
    if (viewMode === 'years') {
      nextDecade();
    }
  };

  const handlePrevPage = () => {
    if (viewMode === 'days') {
      prevMonth();
    }
    if (viewMode === 'months') {
      prevYear();
    }
    if (viewMode === 'years') {
      prevDecade();
    }
  };

  return {
    handleNextPage,
    handlePrevPage,
  };
};
