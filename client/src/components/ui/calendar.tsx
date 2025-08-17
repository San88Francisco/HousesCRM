'use client';
import { cn } from '@/lib/utils';
import {
  add,
  addYears,
  Day,
  eachDayOfInterval,
  eachYearOfInterval,
  endOfDecade,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  getYear,
  isEqual,
  isSameMonth,
  isSameYear,
  isThisYear,
  isToday,
  parse,
  startOfDecade,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { MoveLeft, MoveRight } from 'lucide-react';
import { FC, Fragment, useEffect, useState } from 'react';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface CalendarProps {
  onSelectedDate: (date: Date) => void;
  firstWeekDayNumber?: Day;
}

type viewModeType = 'days' | 'months' | 'years';

const Calendar: FC<CalendarProps> = ({ onSelectedDate, firstWeekDayNumber = 1 }) => {
  const today = startOfToday();
  const [viewMode, setViewMode] = useState<viewModeType>('days');
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  useEffect(() => {
    onSelectedDate(selectedDate);
    console.log(getYear(selectedDate));
  }, [selectedDate]);

  const [currentMonth, setCurrentMonth] = useState<string>(format(today, 'MMM-yyyy'));
  const firtsDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firtsDayCurrentMonth), { weekStartsOn: firstWeekDayNumber }),
    end: endOfWeek(endOfMonth(firtsDayCurrentMonth), { weekStartsOn: firstWeekDayNumber }),
  });

  const calendarYears = eachYearOfInterval({
    start: startOfDecade(today),
    end: addYears(endOfDecade(today), 2),
  });
  console.log(calendarYears);

  const nextMonth = () => {
    const firtsDayNextMonth = add(firtsDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firtsDayNextMonth, 'MMM-yyyy'));
  };

  const prevMonth = () => {
    const firtsDayNextMonth = add(firtsDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firtsDayNextMonth, 'MMM-yyyy'));
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
          <MoveLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-lg font-medium text-gray-900 flex gap-2">
          {/* {format(firtsDayCurrentMonth, 'MMMM yyyy')} */}
          {viewMode === 'days' && (
            <Fragment>
              <button>{format(firtsDayCurrentMonth, 'MMMM')}</button>
              <button onClick={() => setViewMode('years')}>
                {format(firtsDayCurrentMonth, 'yyyy')}
              </button>
            </Fragment>
          )}
          {viewMode === 'years' && (
            <button onClick={() => setViewMode('years')}>
              {getYear(calendarYears[0])}-{getYear(calendarYears[calendarYears.length - 1])}
            </button>
          )}
        </h2>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
          <MoveRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      {viewMode === 'days' && (
        <Fragment>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 mb-6">
            {calendarDays.map(day => (
              <time
                key={day.toString()}
                dateTime={format(day, 'yyyy-MM-dd')}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'h-10 w-10 text-sm rounded-full transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-blue hover:text-white',
                  !isSameMonth(day, firtsDayCurrentMonth) && 'text-dark-medium',
                  isToday(day) && 'border border-solid border-active-border text-active-border',
                  isEqual(day, selectedDate) && 'bg-active-border text-white',
                )}
              >
                {format(day, 'd')}
              </time>
            ))}
          </div>
        </Fragment>
      )}
      {viewMode === 'years' && (
        <div className="grid grid-cols-3 gap-1 mb-6">
          {calendarYears.map(year => (
            <time
              key={year.toString()}
              dateTime={format(year, 'yyyy-MM-dd')}
              onClick={() => setSelectedDate(year)}
              className={cn(
                'h-20 w-20 text-sm rounded-full transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-blue hover:text-white',
                !isSameYear(year, firtsDayCurrentMonth) && 'text-dark-medium',
                isThisYear(year) && 'border border-solid border-active-border text-active-border',
                isEqual(year, selectedDate) && 'bg-active-border text-white',
              )}
            >
              {format(year, 'y')}
            </time>
          ))}
        </div>
      )}
      <div></div>
      <div></div>
    </div>
  );
};

Calendar.displayName = 'Calendar';

export default Calendar;
