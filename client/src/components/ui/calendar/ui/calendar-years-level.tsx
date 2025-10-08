import { FC } from 'react';
import CalendarCell from './calendar-cell';
import {
  endOfYear,
  format,
  isAfter,
  isBefore,
  isSameYear,
  isThisYear,
  startOfYear,
} from 'date-fns';

interface ICalendarYearsLevelProps {
  date: Date;
  handleSelect: (date: Date) => void;
  calendarYears: Date[];
  minDate?: Date;
  maxDate?: Date;
}

const CalendarYearsLevel: FC<ICalendarYearsLevelProps> = ({
  date,
  handleSelect,
  calendarYears,
  minDate,
  maxDate,
}) => {
  const isYearDisabled = (year: Date) => {
    if (minDate && isBefore(endOfYear(year), startOfYear(minDate))) return true;
    if (maxDate && isAfter(startOfYear(year), endOfYear(maxDate))) return true;
    return false;
  };
  return (
    <div className="grid grid-cols-3 gap-y-3 mb-6 place-items-center">
      {calendarYears.map(year => (
        <CalendarCell
          key={year.toString()}
          dateTime={format(year, 'yyyy-MM-dd')}
          onClick={() => handleSelect(year)}
          size="big"
          isCurrentDate={isThisYear(year)}
          isSelected={isSameYear(year, date as Date)}
          isDisabled={isYearDisabled(year)}
        >
          {format(year, 'y')}
        </CalendarCell>
      ))}
    </div>
  );
};

export default CalendarYearsLevel;
