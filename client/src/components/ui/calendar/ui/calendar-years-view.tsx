import {
  Day,
  format,
  isEqual,
  isSameMonth,
  isSameYear,
  isThisYear,
  isToday,
  isWithinInterval,
} from 'date-fns';
import { FC, Fragment, useEffect } from 'react';
import { CalendarMode, DateRange } from '@/types/core/calendar';
import CalendarCell from './calendar-cell';

interface ICalendarYearsViewProps {
  mode: CalendarMode;
  selectedDate: Date | DateRange;
  calendarYears: Date[];
  handleSelect: (date: Date) => void;
  handleHover: (day: Date) => void;
  hoveredDate: DateRange;
}

const CalendarYearsView: FC<ICalendarYearsViewProps> = ({
  mode,
  calendarYears,
  selectedDate,
  handleSelect,
  handleHover,
  hoveredDate,
}) => {
  return (
    <div className="grid grid-cols-3 gap-y-3 mb-6 place-items-center">
      {calendarYears.map(year => {
        if (mode === CalendarMode.Single) {
          return (
            <CalendarCell
              key={year.toString()}
              dateTime={format(year, 'yyyy-MM-dd')}
              onClick={() => handleSelect(year)}
              size="big"
              isCurrentDate={isThisYear(year)}
              isSelected={isSameYear(year, selectedDate as Date)}
            >
              {format(year, 'y')}
            </CalendarCell>
          );
        }

        if (mode === CalendarMode.Range) {
          const rangeStart = hoveredDate.startDate || (selectedDate as DateRange).startDate;
          const rangeEnd = hoveredDate.endDate || (selectedDate as DateRange).endDate;

          const inRange =
            rangeStart && rangeEnd && isWithinInterval(year, { start: rangeStart, end: rangeEnd });

          return (
            <CalendarCell
              key={year.toString()}
              dateTime={format(year, 'yyyy-MM-dd')}
              onClick={() => handleSelect(year)}
              onMouseEnter={() => handleHover(year)}
              size="big"
              isCurrentDate={isThisYear(year)}
              isSelected={isSameYear(year, rangeStart) || isSameYear(year, rangeEnd)}
              isLeftSide={isSameYear(year, rangeStart)}
              isRightSide={isSameYear(year, rangeEnd)}
              inRange={inRange}
            >
              {format(year, 'y')}
            </CalendarCell>
          );
        }
      })}
    </div>
  );
};

export default CalendarYearsView;
