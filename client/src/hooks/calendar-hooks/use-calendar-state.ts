'use client';

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
import { useEffect, useState } from 'react';

const DECADE_GRID_FILLING = 2;

export const useCalendarState = (firstWeekDayNumber: Day, currentDate: Date) => {
  const today = startOfToday();

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

  useEffect(() => {
    setCurrentMonth(format(currentDate, 'MMM-yyyy'));
    setCurrentYear(startOfYear(currentDate));
    setCurrentDecadeStart(startOfDecade(currentDate));
  }, [currentDate]);

  return {
    today,
    currentMonth,
    setCurrentMonth,
    firstDayCurrentMonth,
    calendarDays,
    currentDecadeStart,
    setCurrentDecadeStart,
    calendarYears,
    calendarMonths,
    currentYear,
    setCurrentYear,
  };
};
