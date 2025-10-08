import { FC, useState } from 'react';
import CalendarHeader from './calendar-header';
import CalendarDaysLevel from './calendar-days-level';
import CalendarMonthsLevel from './calendar-months-level';
import CalendarYearsLevel from './calendar-years-level';
import { Day, Locale } from 'date-fns';
import { useCalendarState } from '@/hooks/CalendarHooks/use-calendar-state';
import { useCalendarNavigation } from '@/hooks/CalendarHooks/use-calendar-navigation';
import { CalendarMode, levelMap, levelType } from '@/types/core/calendar';

interface ICalendarDisplayProps {
  lang: Locale;
  firstWeekDayNumber: Day;
  date: Date;
  setDate: (range: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  mode: CalendarMode;
}

const CalendarDisplay: FC<ICalendarDisplayProps> = ({
  firstWeekDayNumber,
  date,
  setDate,
  minDate,
  maxDate,
  lang,
  mode,
}) => {
  const [level, setLevel] = useState<levelType>(levelMap[mode]);

  const nextLevelMap: Record<CalendarMode, Partial<Record<levelType, levelType>>> = {
    year: {},
    yearMonth: { years: 'months' },
    yearMonthDay: { years: 'months', months: 'days' },
  };

  const handleSelect = (date: Date) => {
    setDate(date);

    const nextLevel = nextLevelMap[mode][level];
    if (nextLevel) setLevel(nextLevel);
  };

  const {
    setCurrentMonth,
    firstDayCurrentMonth,
    calendarDays,
    calendarMonths,
    currentDecadeStart,
    setCurrentDecadeStart,
    currentYear,
    calendarYears,
    setCurrentYear,
  } = useCalendarState(firstWeekDayNumber, date);

  const { handlePrevPage, handleNextPage } = useCalendarNavigation({
    level,
    firstDayCurrentMonth,
    currentDecadeStart,
    currentYear,
    setCurrentMonth,
    setCurrentDecadeStart,
    setCurrentYear,
  });

  return (
    <div className="w-72">
      <CalendarHeader
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        firstDayCurrentMonth={firstDayCurrentMonth}
        currentYear={currentYear}
        calendarYears={calendarYears}
        level={level}
        setLevel={setLevel}
        lang={lang}
      />
      {mode === 'yearMonthDay' && level === 'days' && (
        <CalendarDaysLevel
          handleSelect={handleSelect}
          date={date}
          firstDayCurrentMonth={firstDayCurrentMonth}
          firstWeekDayNumber={firstWeekDayNumber}
          calendarDays={calendarDays}
          minDate={minDate}
          maxDate={maxDate}
          lang={lang}
        />
      )}
      {mode !== 'year' && level === 'months' && (
        <CalendarMonthsLevel
          handleSelect={handleSelect}
          date={date}
          calendarMonths={calendarMonths}
          minDate={minDate}
          maxDate={maxDate}
          lang={lang}
        />
      )}
      {level === 'years' && (
        <CalendarYearsLevel
          handleSelect={handleSelect}
          date={date}
          calendarYears={calendarYears}
          minDate={minDate}
          maxDate={maxDate}
          lang={lang}
        />
      )}
    </div>
  );
};

export default CalendarDisplay;
