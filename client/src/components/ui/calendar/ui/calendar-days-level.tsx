import { FC, Fragment } from 'react';
import CalendarCell from './calendar-cell';
import {
  Day,
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isEqual,
  isSameMonth,
  isToday,
  Locale,
  startOfDay,
  startOfWeek,
} from 'date-fns';

interface ICalendarDaysLevelProps {
  date: Date;
  handleSelect: (date: Date) => void;
  firstDayCurrentMonth: Date;
  firstWeekDayNumber: Day;
  calendarDays: Date[];
  minDate?: Date;
  maxDate?: Date;
  lang: Locale;
}

const getDaysOfWeek = (locale: Locale, firstWeekDayNumber: Day): string[] => {
  const start = startOfWeek(new Date(), { locale, weekStartsOn: firstWeekDayNumber });
  const end = endOfWeek(new Date(), { locale, weekStartsOn: firstWeekDayNumber });

  return eachDayOfInterval({ start, end }).map(day => format(day, 'EEEEEE', { locale }));
};

const CalendarDaysLevel: FC<ICalendarDaysLevelProps> = ({
  date,
  handleSelect,
  firstDayCurrentMonth,
  firstWeekDayNumber,
  calendarDays,
  minDate,
  maxDate,
  lang,
}) => {
  const daysOfWeek = getDaysOfWeek(lang, firstWeekDayNumber);

  const isDateDisabled = (day: Date) => {
    if (minDate && isBefore(day, startOfDay(minDate))) return true;
    if (maxDate && isAfter(day, endOfDay(maxDate))) return true;
    return false;
  };

  const isInRange = (day: Date): boolean => {
    if (!minDate && !maxDate) return false;
    const start = minDate ?? date;
    const end = maxDate ?? date;

    if (!start || !end) return false;

    const rangeStart = isBefore(start, end) ? startOfDay(start) : startOfDay(end);
    const rangeEnd = isAfter(end, start) ? endOfDay(end) : endOfDay(start);

    return !isBefore(day, rangeStart) && !isAfter(day, rangeEnd);
  };

  const isLeftSide = (day: Date) => {
    if (!minDate && !maxDate) return false;

    const start = minDate ?? date;
    const end = maxDate ?? date;

    const rangeStart = isBefore(start, end) ? startOfDay(start) : startOfDay(end);

    return isEqual(day, rangeStart);
  };

  const isRightSide = (day: Date) => {
    if (!minDate && !maxDate) return false;

    const start = minDate ?? date;
    const end = maxDate ?? date;

    const rangeEnd = isAfter(end, start) ? startOfDay(end) : startOfDay(start);

    return isEqual(day, rangeEnd);
  };

  return (
    <Fragment>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1 mb-6">
        {calendarDays.map(day => (
          <CalendarCell
            key={day.toString()}
            dateTime={format(day, 'yyyy-MM-dd', { locale: lang })}
            onClick={() => handleSelect(day)}
            size="small"
            isOutOfPeriod={!isSameMonth(day, firstDayCurrentMonth)}
            isCurrentDate={isToday(day)}
            isSelected={isEqual(day, date as Date)}
            isDisabled={isDateDisabled(day)}
            inRange={isInRange(day)}
            isRightSide={isRightSide(day)}
            isLeftSide={isLeftSide(day)}
          >
            {format(day, 'd', { locale: lang })}
          </CalendarCell>
        ))}
      </div>
    </Fragment>
  );
};

export default CalendarDaysLevel;
