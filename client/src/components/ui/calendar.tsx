'use client';
import { cn } from '@/lib/utils';
import {
  add,
  Day,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { MoveLeft, MoveRight } from 'lucide-react';
import { FC, useEffect, useState } from 'react';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface CalendarProps {
  onSelectedDate: (date: Date) => void;
  firstWeekDayNumber?: Day;
}

const Calendar: FC<CalendarProps> = ({ onSelectedDate, firstWeekDayNumber = 1 }) => {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  useEffect(() => {
    onSelectedDate(selectedDate);
  }, [selectedDate]);

  const [currentMonth, setCurrentMonth] = useState<string>(format(today, 'MMM-yyyy'));
  const firtsDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firtsDayCurrentMonth), { weekStartsOn: firstWeekDayNumber }),
    end: endOfWeek(endOfMonth(firtsDayCurrentMonth), { weekStartsOn: firstWeekDayNumber }),
  });

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

        <h2 className="text-lg font-medium text-gray-900">
          {format(firtsDayCurrentMonth, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
          <MoveRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
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
      <div></div>
      <div></div>
    </div>
  );
};

Calendar.displayName = 'Calendar';

export default Calendar;
