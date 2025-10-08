import { FC } from 'react';
import CalendarCell from './calendar-cell';
import {
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameMonth,
  isThisMonth,
  Locale,
  startOfMonth,
} from 'date-fns';

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
    if (minDate && isBefore(endOfMonth(month), startOfMonth(minDate))) return true;
    if (maxDate && isAfter(startOfMonth(month), endOfMonth(maxDate))) return true;
    return false;
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
        >
          {format(month, 'MMM', { locale: lang })}
        </CalendarCell>
      ))}
    </div>
  );
};

export default CalendarMonthsLevel;
