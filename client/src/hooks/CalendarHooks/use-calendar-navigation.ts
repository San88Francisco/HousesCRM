'use client';
import { viewModeType } from '@/types/core/calendar';
import { add, addYears, format } from 'date-fns';

const DECADE_PAGE_STEP = 10;
const MONTHS_PAGE_STEP = 1;

type useCalendarNavigationProps = {
  viewMode: viewModeType;
  firtsDayCurrentMonth: Date;
  currentDecadeStart: Date;
  setCurrentMonth: (currentMonth: string) => void;
  setCurrentDecadeStart: (currentDecadeStart: Date) => void;
};

export const useCalendarNavigation = ({
  viewMode,
  firtsDayCurrentMonth,
  currentDecadeStart,
  setCurrentMonth,
  setCurrentDecadeStart,
}: useCalendarNavigationProps) => {
  const nextMonth = () => {
    const firtsDayNextMonth = add(firtsDayCurrentMonth, { months: MONTHS_PAGE_STEP });
    setCurrentMonth(format(firtsDayNextMonth, 'MMM-yyyy'));
  };

  const prevMonth = () => {
    const firtsDayNextMonth = add(firtsDayCurrentMonth, { months: -MONTHS_PAGE_STEP });
    setCurrentMonth(format(firtsDayNextMonth, 'MMM-yyyy'));
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
    if (viewMode === 'years') {
      nextDecade();
    }
  };

  const handlePrevPage = () => {
    if (viewMode === 'days') {
      prevMonth();
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
