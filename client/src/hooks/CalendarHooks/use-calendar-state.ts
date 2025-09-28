'use client';
import { DateRange, viewModeType } from '@/types/core/calendar';
import {
  addYears,
  Day,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfDecade,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parse,
  startOfDecade,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { useState } from 'react';

const DECADE_GRID_FILLING = 2;

export const useCalendarState = (firstWeekDayNumber: Day) => {
  const today = startOfToday();
  const [viewMode, setViewMode] = useState<viewModeType>('days');
  const [currentMonth, setCurrentMonth] = useState<string>(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firstDayCurrentMonth), { weekStartsOn: firstWeekDayNumber }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: firstWeekDayNumber }),
  });

  const [currentYear, setCurrentYear] = useState<Date>(startOfYear(today));
  const calendarMonths = eachMonthOfInterval({
    start: startOfYear(currentYear),
    end: endOfYear(currentYear),
  });
  const [currentDecadeStart, setCurrentDecadeStart] = useState<Date>(startOfDecade(today));

  const calendarYears = eachYearOfInterval({
    start: startOfDecade(currentDecadeStart),
    end: addYears(endOfDecade(currentDecadeStart), DECADE_GRID_FILLING),
  });

  const [hoveredDate, setHoveredDate] = useState<DateRange>({
    startDate: today,
    endDate: today,
  });
  return {
    today,
    viewMode,
    setViewMode,
    currentMonth,
    setCurrentMonth,
    firstDayCurrentMonth,
    calendarDays,
    currentDecadeStart,
    setCurrentDecadeStart,
    calendarYears,
    hoveredDate,
    setHoveredDate,
    calendarMonths,
    currentYear,
    setCurrentYear,
  };
};
