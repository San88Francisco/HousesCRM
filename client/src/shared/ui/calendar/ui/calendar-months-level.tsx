import { FC } from 'react';
import CalendarCell from './calendar-cell';
import {
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isEqual,
  isSameMonth,
  isThisMonth,
  Locale,
  startOfMonth,
} from 'date-fns';
/* eslint-disable */

interface ICalendarMonthsLevelProps {
  date: Date;
  handleSelect: (date: Date) => void;
  calendarMonths: Date[];
  minDate?: Date;
  maxDate?: Date;
  lang: Locale;
}

const CalendarMonthsLevel: FC<ICalendarMonthsLevelProps> = ({
  date,
  handleSelect,
  calendarMonths,
  minDate,
  maxDate,
  lang,
}) => {
  const isMonthDisabled = (month: Date) => {
    if (minDate && isBefore(endOfMonth(month), startOfMonth(minDate))) {
      return true;
    }
    if (maxDate && isAfter(startOfMonth(month), endOfMonth(maxDate))) {
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

    const rangeStart = isBefore(start, end) ? startOfMonth(start) : startOfMonth(end);
    const rangeEnd = isAfter(end, start) ? endOfMonth(end) : endOfMonth(start);

    return !isBefore(day, rangeStart) && !isAfter(day, rangeEnd);
  };

  const isLeftSide = (day: Date) => {
    if (!minDate && !maxDate) {
      return false;
    }

    const start = minDate ?? date;
    const end = maxDate ?? date;

    const rangeStart = isBefore(start, end) ? startOfMonth(start) : startOfMonth(end);

    return isEqual(day, rangeStart);
  };

  const isRightSide = (day: Date) => {
    if (!minDate && !maxDate) {
      return false;
    }

    const start = minDate ?? date;
    const end = maxDate ?? date;

    const rangeEnd = isAfter(end, start) ? startOfMonth(end) : startOfMonth(start);

    return isEqual(day, rangeEnd);
  };

  return (
    <div className="grid grid-cols-3 gap-y-3 mb-6 place-items-center">
      {calendarMonths.map(month => (
        <CalendarCell
          key={month.toString()}
          dateTime={format(month, 'yyyy-MM-dd', { locale: lang })}
          onClick={() => handleSelect(month)}
          size="big"
          isCurrentDate={isThisMonth(month)}
          isSelected={isSameMonth(month, date as Date)}
          isDisabled={isMonthDisabled(month)}
          inRange={isInRange(month)}
          isRightSide={isRightSide(month)}
          isLeftSide={isLeftSide(month)}
        >
          {format(month, 'MMM', { locale: lang })}
        </CalendarCell>
      ))}
    </div>
  );
};

export default CalendarMonthsLevel;
