'use client';
import { DateRange, viewModeType } from '@/types/core/calendar';
import {
  addYears,
  Day,
  eachDayOfInterval,
  eachYearOfInterval,
  endOfDecade,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfDecade,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { useState } from 'react';

const DECADE_GRID_FILLING = 2;

export const useCalendarState = (firstWeekDayNumber: Day) => {
  const today = startOfToday();
  const [viewMode, setViewMode] = useState<viewModeType>('days');
  const [currentMonth, setCurrentMonth] = useState<string>(format(today, 'MMM-yyyy'));
  const firtsDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firtsDayCurrentMonth), { weekStartsOn: firstWeekDayNumber }),
    end: endOfWeek(endOfMonth(firtsDayCurrentMonth), { weekStartsOn: firstWeekDayNumber }),
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
    firtsDayCurrentMonth,
    calendarDays,
    currentDecadeStart,
    setCurrentDecadeStart,
    calendarYears,
    hoveredDate,
    setHoveredDate,
  };
};
