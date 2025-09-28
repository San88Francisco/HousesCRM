import { format, isSameMonth, isThisMonth, isWithinInterval } from 'date-fns';
import { FC } from 'react';
import { CalendarMode, DateRange } from '@/types/core/calendar';
import CalendarCell from './calendar-cell';

interface ICalendarMonthsViewProps {
  mode: CalendarMode;
  selectedDate: Date | DateRange;
  calendarMonths: Date[];
  handleSelect: (date: Date) => void;
  handleHover: (day: Date) => void;
  hoveredDate: DateRange;
}

const CalendarMonthsView: FC<ICalendarMonthsViewProps> = ({
  mode,
  calendarMonths,
  selectedDate,
  handleSelect,
  handleHover,
  hoveredDate,
}) => {
  return (
    <div className="grid grid-cols-3 gap-y-3 mb-6 place-items-center">
      {calendarMonths.map(month => {
        if (mode === CalendarMode.Single) {
          return (
            <CalendarCell
              key={month.toString()}
              dateTime={format(month, 'yyyy-MM-dd')}
              onClick={() => handleSelect(month)}
              size="big"
              isCurrentDate={isThisMonth(month)}
              isSelected={isSameMonth(month, selectedDate as Date)}
            >
              {format(month, 'MMM')}
            </CalendarCell>
          );
        }

        if (mode === CalendarMode.Range) {
          const rangeStart = hoveredDate.startDate || (selectedDate as DateRange).startDate;
          const rangeEnd = hoveredDate.endDate || (selectedDate as DateRange).endDate;

          const inRange =
            rangeStart && rangeEnd && isWithinInterval(month, { start: rangeStart, end: rangeEnd });

          return (
            <CalendarCell
              key={month.toString()}
              dateTime={format(month, 'yyyy-MM-dd')}
              onClick={() => handleSelect(month)}
              onMouseEnter={() => handleHover(month)}
              size="big"
              isCurrentDate={isThisMonth(month)}
              isSelected={isSameMonth(month, rangeStart) || isSameMonth(month, rangeEnd)}
              isLeftSide={isSameMonth(month, rangeStart)}
              isRightSide={isSameMonth(month, rangeEnd)}
              inRange={inRange}
            >
              {format(month, 'MMM')}
            </CalendarCell>
          );
        }
      })}
    </div>
  );
};

export default CalendarMonthsView;
