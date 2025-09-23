import { CalendarMode, DateRange } from '@/types/core/calendar';
import { FC, Fragment } from 'react';
import CalendarCell from './calendar-cell';
import { format, isEqual, isSameMonth, isToday, isWithinInterval } from 'date-fns';

interface ICalendarDaysViewProps {
  mode: CalendarMode;
  selectedDate: Date | DateRange;
  calendarDays: Date[];
  handleSelect: (date: Date) => void;
  handleHover: (day: Date) => void;
  hoveredDate: DateRange;
  firstDayCurrentMonth: Date;
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CalendarDaysView: FC<ICalendarDaysViewProps> = ({
  mode,
  calendarDays,
  selectedDate,
  handleSelect,
  handleHover,
  hoveredDate,
  firstDayCurrentMonth,
}) => {
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
        {calendarDays.map(day => {
          if (mode === CalendarMode.Single) {
            return (
              <CalendarCell
                key={day.toString()}
                dateTime={format(day, 'yyyy-MM-dd')}
                onClick={() => handleSelect(day)}
                size="small"
                isOutOfPeriod={!isSameMonth(day, firstDayCurrentMonth)}
                isCurrentDate={isToday(day)}
                isSelected={isEqual(day, selectedDate as Date)}
              >
                {format(day, 'd')}
              </CalendarCell>
            );
          }

          if (mode === CalendarMode.Range) {
            const rangeStart = hoveredDate.startDate || (selectedDate as DateRange).startDate;
            const rangeEnd = hoveredDate.endDate || (selectedDate as DateRange).endDate;

            const inRange =
              rangeStart && rangeEnd && isWithinInterval(day, { start: rangeStart, end: rangeEnd });

            return (
              <CalendarCell
                key={day.toString()}
                dateTime={format(day, 'yyyy-MM-dd')}
                onClick={() => handleSelect(day)}
                onMouseEnter={() => handleHover(day)}
                size="small"
                isOutOfPeriod={!isSameMonth(day, firstDayCurrentMonth)}
                isCurrentDate={isToday(day)}
                isSelected={isEqual(day, rangeEnd) || isEqual(day, rangeStart)}
                isLeftSide={isEqual(day, rangeStart)}
                isRightSide={isEqual(day, rangeEnd)}
                inRange={inRange}
              >
                {format(day, 'd')}
              </CalendarCell>
            );
          }
        })}
      </div>
    </Fragment>
  );
};

export default CalendarDaysView;
