import {
  endOfYear,
  format,
  isAfter,
  isBefore,
  isEqual,
  isSameYear,
  isThisYear,
  Locale,
  startOfYear,
} from 'date-fns';
import { FC } from 'react';
import CalendarCell from './CalendarCell';
/* eslint-disable */

interface ICalendarYearsLevelProps {
  date: Date;
  handleSelect: (date: Date) => void;
  calendarYears: Date[];
  minDate?: Date;
  maxDate?: Date;
  lang: Locale;
}

const CalendarYearsLevel: FC<ICalendarYearsLevelProps> = ({
  date,
  handleSelect,
  calendarYears,
  minDate,
  maxDate,
  lang,
}) => {
  const isYearDisabled = (year: Date) => {
    if (minDate && isBefore(endOfYear(year), startOfYear(minDate))) {
      return true;
    }
    if (maxDate && isAfter(startOfYear(year), endOfYear(maxDate))) {
      return true;
    }
    return false;
  };
  const isInRange = (day: Date): boolean => {
    if (!minDate && !maxDate) {
      return false;
    }

    const start = minDate ?? date;
    const end = maxDate ?? date;

    if (!start || !end) {
      return false;
    }

    const rangeStart = isBefore(start, end) ? startOfYear(start) : startOfYear(end);
    const rangeEnd = isAfter(end, start) ? endOfYear(end) : endOfYear(start);

    return !isBefore(day, rangeStart) && !isAfter(day, rangeEnd);
  };

  const isLeftSide = (day: Date) => {
    if (!minDate && !maxDate) {
      return false;
    }

    const start = minDate ?? date;
    const end = maxDate ?? date;

    const rangeStart = isBefore(start, end) ? startOfYear(start) : startOfYear(end);

    return isEqual(day, rangeStart);
  };

  const isRightSide = (day: Date) => {
    if (!minDate && !maxDate) {
      return false;
    }

    const start = minDate ?? date;
    const end = maxDate ?? date;

    const rangeEnd = isAfter(end, start) ? startOfYear(end) : startOfYear(start);

    return isEqual(day, rangeEnd);
  };
  return (
    <div className="grid grid-cols-3 gap-y-3 mb-6 place-items-center">
      {calendarYears.map(year => (
        <CalendarCell
          key={year.toString()}
          dateTime={format(year, 'yyyy-MM-dd', { locale: lang })}
          onClick={() => handleSelect(year)}
          size="big"
          isCurrentDate={isThisYear(year)}
          isSelected={isSameYear(year, date as Date)}
          isDisabled={isYearDisabled(year)}
          inRange={isInRange(year)}
          isRightSide={isRightSide(year)}
          isLeftSide={isLeftSide(year)}
        >
          {format(year, 'y', { locale: lang })}
        </CalendarCell>
      ))}
    </div>
  );
};

export default CalendarYearsLevel;
