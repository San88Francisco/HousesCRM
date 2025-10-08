import { FC, useState } from 'react';
import CalendarHeader from './calendar-header';
import CalendarDaysLevel from './calendar-days-level';
import CalendarMonthsLevel from './calendar-months-level';
import CalendarYearsLevel from './calendar-years-level';
import { Day } from 'date-fns';
import { useCalendarState } from '@/hooks/CalendarHooks/use-calendar-state';
import { useCalendarNavigation } from '@/hooks/CalendarHooks/use-calendar-navigation';
import { levelType } from '@/types/core/calendar';

interface ICalendarDisplayProps {
  firstWeekDayNumber: Day;
  date: Date;
  setDate: (range: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const CalendarDisplay: FC<ICalendarDisplayProps> = ({
  firstWeekDayNumber,
  date,
  setDate,
  minDate,
  maxDate,
}) => {
  const [level, setLevel] = useState<levelType>('days');

  const handleSelect = (date: Date) => {
    setDate(date);

    if (level === 'years') {
      setLevel('months');
    } else if (level === 'months') {
      setLevel('days');
    }
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
      />
      {level === 'days' && (
        <CalendarDaysLevel
          handleSelect={handleSelect}
          date={date}
          firstDayCurrentMonth={firstDayCurrentMonth}
          calendarDays={calendarDays}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
      {level === 'months' && (
        <CalendarMonthsLevel
          handleSelect={handleSelect}
          date={date}
          calendarMonths={calendarMonths}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
      {level === 'years' && (
        <CalendarYearsLevel
          handleSelect={handleSelect}
          date={date}
          calendarYears={calendarYears}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    </div>
  );
};

export default CalendarDisplay;
