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
  getYear,
  isEqual,
  isSameMonth,
  isThisYear,
  isToday,
  isWithinInterval,
  parse,
  startOfDecade,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { MoveLeft, MoveRight } from 'lucide-react';
import { FC, Fragment, useEffect, useState } from 'react';
import { Button } from './button';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// type CalendarMode = 'single' | 'range';

//! local, mode = single | range, viewMode?

export enum CalendarMode {
  Single = 'single',
  Range = 'range',
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

type SingleModeCalendarProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  firstWeekDayNumber?: Day;
};

type RangeModeCalendarProps = {
  selectedDate: DateRange;
  setSelectedDate: (dateRange: DateRange) => void;
  firstWeekDayNumber?: Day;
};

type CalendarProps =
  | ({ mode: CalendarMode.Single } & SingleModeCalendarProps)
  | ({ mode: CalendarMode.Range } & RangeModeCalendarProps);

type viewModeType = 'days' | 'months' | 'years';

const Calendar: FC<CalendarProps> = ({
  selectedDate,
  setSelectedDate,
  mode,
  firstWeekDayNumber = 1,
}) => {
  const today = startOfToday();
  const [viewMode, setViewMode] = useState<viewModeType>('days');

  useEffect(() => {
    if (mode === CalendarMode.Single) {
      setSelectedDate(today);
    } else {
      setSelectedDate({
        startDate: today,
        endDate: today,
      });
    }
  }, []);

  const [currentMonth, setCurrentMonth] = useState<string>(format(today, 'MMM-yyyy'));
  const firtsDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(firtsDayCurrentMonth), { weekStartsOn: firstWeekDayNumber }),
    end: endOfWeek(endOfMonth(firtsDayCurrentMonth), { weekStartsOn: firstWeekDayNumber }),
  });

  const [currentDecadeStart, setCurrentDecadeStart] = useState<Date>(startOfDecade(today));

  const calendarYears = eachYearOfInterval({
    start: startOfDecade(currentDecadeStart),
    end: addYears(endOfDecade(currentDecadeStart), 2),
  });

  const [hoveredDate, setHoveredDate] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const nextMonth = () => {
    const firtsDayNextMonth = add(firtsDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firtsDayNextMonth, 'MMM-yyyy'));
  };

  const prevMonth = () => {
    const firtsDayNextMonth = add(firtsDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firtsDayNextMonth, 'MMM-yyyy'));
  };

  const nextDecade = () => {
    setCurrentDecadeStart(addYears(currentDecadeStart, 10));
  };

  const prevDecade = () => {
    setCurrentDecadeStart(addYears(currentDecadeStart, -10));
  };

  const handleNextPage = () => {
    if (viewMode === 'days') {
      nextMonth();
    }
    if (viewMode === 'years') {
      nextDecade();
    }
  };

  const handlePrevPage = () => {
    if (viewMode === 'days') {
      prevMonth();
    }
    if (viewMode === 'years') {
      prevDecade();
    }
  };

  const handleSelect = (date: Date) => {
    if (mode === CalendarMode.Single) {
      setSelectedDate(date);
      return;
    }

    if (mode === CalendarMode.Range) {
      const { startDate, endDate } = selectedDate;

      if (startDate !== endDate) {
        setSelectedDate({ startDate: date, endDate: date });
        setHoveredDate({
          startDate: date,
          endDate: date,
        });
      } else if (startDate > date) {
        const savedState = startDate;
        setSelectedDate({
          startDate: date,
          endDate: savedState,
        });
      } else {
        const savedState = startDate;
        setSelectedDate({
          startDate: savedState,
          endDate: date,
        });
      }
    }
  };

  const handleHover = (date: Date) => {
    if (mode !== CalendarMode.Range) return;

    const { startDate, endDate } = selectedDate;

    if (!startDate) return;
    if (endDate && startDate !== endDate) return;

    setHoveredDate({
      startDate: selectedDate.startDate < date ? selectedDate.startDate : date,
      endDate: selectedDate.startDate < date ? date : selectedDate.startDate,
    });
  };

  // todo delete local state
  //todo range mode styles
  // todo change page to the peaked year date
  return (
    <div className="w-78 bg-background rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevPage} className="p-1 hover:bg-gray-100 rounded">
          <MoveLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-lg font-bold font-medium text-gray-900 flex gap-2">
          {viewMode === 'days' && (
            <Fragment>
              <button>{format(firtsDayCurrentMonth, 'MMMM')}</button>
              <button onClick={() => setViewMode('years')}>
                {format(firtsDayCurrentMonth, 'yyyy')}
              </button>
            </Fragment>
          )}
          {viewMode === 'years' && (
            <button onClick={() => setViewMode('days')}>
              {getYear(calendarYears[0])}-{getYear(calendarYears[calendarYears.length - 1])}
            </button>
          )}
        </h2>
        <button onClick={handleNextPage} className="p-1 hover:bg-gray-100 rounded">
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
            {calendarDays.map(day => {
              mode === CalendarMode.Single && (
                <time
                  key={day.toString()}
                  dateTime={format(day, 'yyyy-MM-dd')}
                  onClick={() => handleSelect(day)}
                  className={cn(
                    'h-[2.125rem] w-[2.5rem] text-sm font-semibold rounded-[0.75rem] transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                    !isSameMonth(day, firtsDayCurrentMonth) && 'text-dark-medium',
                    isToday(day) &&
                      'border border-solid border-active-border text-active-border hover:border-blue-dark hover:text-blue-dark hover:bg-[#dbeafe]', //todo
                    // mode === CalendarMode.Single &&
                    isEqual(day, selectedDate) &&
                      'bg-active-border text-white hover:text-white hover:bg-blue-dark',

                    // mode === CalendarMode.Range &&
                    //   cn(
                    //     isEqual(day, selectedDate.startDate) &&
                    //       'bg-active-border text-white hover:text-white hover:bg-blue-dark',
                    //     isEqual(day, selectedDate.endDate) &&
                    //       'bg-active-border text-white hover:text-white hover:bg-blue-dark ',
                    //   ),
                  )}
                >
                  {format(day, 'd')}
                </time>
              );

              if (mode === CalendarMode.Range) {
                const rangeStart = hoveredDate.startDate || selectedDate.startDate;
                const rangeEnd = hoveredDate.endDate || selectedDate.endDate;

                const inRange =
                  rangeStart &&
                  rangeEnd &&
                  isWithinInterval(day, { start: rangeStart, end: rangeEnd });

                return (
                  <time
                    key={day.toString()}
                    dateTime={format(day, 'yyyy-MM-dd')}
                    onClick={() => handleSelect(day)}
                    onMouseEnter={() => handleHover(day)}
                    className={cn(
                      'h-[2.125rem] w-[2.5rem] rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                      !isSameMonth(day, firtsDayCurrentMonth) && 'text-dark-medium',
                      isToday(day) &&
                        'border border-solid border-active-border text-active-border hover:border-blue-dark hover:text-blue-dark hover:bg-[#dbeafe]',
                      inRange && 'bg-dark-lightest rounded-[0]',
                      isEqual(day, rangeStart) &&
                        'rounded-l-[0.75rem] ml-[2px] bg-active-border text-white hover:text-white hover:bg-blue-dark',
                      isEqual(day, rangeEnd) &&
                        'rounded-r-[0.75rem] mr-[0.375rem] bg-active-border text-white hover:text-white hover:bg-blue-dark',
                    )}
                  >
                    {format(day, 'd')}
                  </time>
                );
              }
            })}
          </div>
        </Fragment>
      )}
      {/* {viewMode === 'years' && (
        <div className="grid grid-cols-3 gap-y-3 mb-6 place-items-center">
          {calendarYears.map(year => (
            <time
              key={year.toString()}
              dateTime={format(year, 'yyyy-MM-dd')}
              onClick={() => setSelectedDate(year)}
              className={cn(
                'h-[40px] w-[75px] text-md font-semibold text-center rounded-[0.75rem] transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                isThisYear(year) &&
                  'border border-solid border-active-border text-active-border hover:border-blue-dark hover:text-blue-dark hover:bg-transparent',
                isEqual(year, selectedDate) &&
                  'bg-active-border text-white hover:text-white hover:bg-blue-dark',
              )}
            >
              {format(year, 'y')}
            </time>
          ))}
        </div>
      )} */}
      {/* <div className='flex gap-5'>
        <Button variant='default' className='bg'>Ok</Button>
        <Button variant='outline'>Cancel</Button>
      </div> */}
    </div>
  );
};

Calendar.displayName = 'Calendar';

export default Calendar;
