'use client';
import { cn } from '@/lib/utils';
import {
  Day,
  format,
  getYear,
  isEqual,
  isSameMonth,
  isSameYear,
  isThisYear,
  isToday,
  isWithinInterval,
} from 'date-fns';
import { MoveLeft, MoveRight } from 'lucide-react';
import { FC, Fragment, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarMode, DateRange } from '@/types/core/calendar';
import { useCalendarState } from '@/hooks/CalendarHooks/use-calendar-state';
import { useCalendarNavigation } from '@/hooks/CalendarHooks/use-calendar-navigation';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

const Calendar: FC<CalendarProps> = ({
  selectedDate,
  setSelectedDate,
  mode,
  firstWeekDayNumber = 1,
}) => {
  const {
    today,
    viewMode,
    setViewMode,
    setCurrentMonth,
    firtsDayCurrentMonth,
    calendarDays,
    currentDecadeStart,
    setCurrentDecadeStart,
    calendarYears,
    hoveredDate,
    setHoveredDate,
  } = useCalendarState(firstWeekDayNumber);

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

  const { handlePrevPage, handleNextPage } = useCalendarNavigation({
    viewMode,
    firtsDayCurrentMonth,
    currentDecadeStart,
    setCurrentMonth,
    setCurrentDecadeStart,
  });

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

  const handleCancel = () => {
    if (mode === CalendarMode.Single) {
      setSelectedDate(today);
    }
    if (mode === CalendarMode.Range) {
      setSelectedDate({
        startDate: today,
        endDate: today,
      });
      setHoveredDate({
        startDate: today,
        endDate: today,
      });
    }
  };

  // todo change page to the peaked year date
  return (
    <div className="w-80 bg-background rounded-lg shadow-lg p-4">
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
          <div className="grid grid-cols-7 gap-y-1 mb-6">
            {calendarDays.map(day => {
              if (mode === CalendarMode.Single) {
                return (
                  <time
                    key={day.toString()}
                    dateTime={format(day, 'yyyy-MM-dd')}
                    onClick={() => handleSelect(day)}
                    className={cn(
                      'h-[2.125rem] w-full text-sm font-semibold rounded-[0.75rem] transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                      !isSameMonth(day, firtsDayCurrentMonth) && 'text-dark-medium',
                      isToday(day) &&
                        'border border-solid border-active-border text-active-border hover:border-blue-dark hover:text-blue-dark hover:bg-[#dbeafe]', //todo
                      isEqual(day, selectedDate) &&
                        'bg-active-border text-white hover:text-white hover:bg-blue-dark',
                    )}
                  >
                    {format(day, 'd')}
                  </time>
                );
              }

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
                      'h-[2.125rem] w-full rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                      !isSameMonth(day, firtsDayCurrentMonth) && 'text-dark-medium',
                      isToday(day) &&
                        'border border-solid border-active-border text-active-border hover:border-blue-dark hover:text-blue-dark hover:bg-[#dbeafe]',
                      inRange && 'bg-dark-lightest rounded-[0]',
                      isEqual(day, rangeStart) &&
                        'rounded-l-[0.75rem] bg-active-border text-white hover:text-white hover:bg-blue-dark',
                      isEqual(day, rangeEnd) &&
                        'rounded-r-[0.75rem] bg-active-border text-white hover:text-white hover:bg-blue-dark',
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
      {viewMode === 'years' && (
        <div className="grid grid-cols-3 gap-y-3 mb-6 place-items-center">
          {calendarYears.map(year => {
            if (mode === CalendarMode.Single) {
              return (
                <time
                  key={year.toString()}
                  dateTime={format(year, 'yyyy-MM-dd')}
                  onClick={() => setSelectedDate(year)}
                  className={cn(
                    'h-[40px] w-full text-md font-semibold text-center rounded-[0.75rem] transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                    isThisYear(year) &&
                      'border border-solid border-active-border text-active-border hover:border-blue-dark hover:text-blue-dark hover:bg-transparent',
                    isSameYear(year, selectedDate) &&
                      'bg-active-border text-white hover:text-white hover:bg-blue-dark',
                  )}
                >
                  {format(year, 'y')}
                </time>
              );
            }

            if (mode === CalendarMode.Range) {
              const rangeStart = hoveredDate.startDate || selectedDate.startDate;
              const rangeEnd = hoveredDate.endDate || selectedDate.endDate;

              const inRange =
                rangeStart &&
                rangeEnd &&
                isWithinInterval(year, { start: rangeStart, end: rangeEnd });

              return (
                <time
                  key={year.toString()}
                  dateTime={format(year, 'yyyy-MM-dd')}
                  onClick={() => handleSelect(year)}
                  onMouseEnter={() => handleHover(year)}
                  className={cn(
                    'h-[40px] w-full rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                    !isSameYear(year, firtsDayCurrentMonth) && 'text-dark-medium',
                    isThisYear(year) &&
                      'border border-solid border-active-border text-active-border hover:border-blue-dark hover:text-blue-dark hover:bg-[#dbeafe]',
                    inRange && 'bg-dark-lightest rounded-[0]',
                    isSameYear(year, rangeStart) &&
                      'rounded-l-[0.75rem] ml-[2px] rounded-r-[0] bg-active-border text-white hover:text-white hover:bg-blue-dark',
                    isSameYear(year, rangeEnd) &&
                      'rounded-r-[0.75rem] mr-[2px] bg-active-border text-white hover:text-white hover:bg-blue-dark',
                  )}
                >
                  {format(year, 'y')}
                </time>
              );
            }
          })}
        </div>
      )}
      <div className="flex gap-5">
        <Button
          // onClick={handleConfirmBtn}
          type="submit"
          variant="default"
          className="bg-active-border hover:bg-blue-dark active:bg-active-border w-full"
        >
          Ok
        </Button>
        <Button onClick={handleCancel} variant="outline" className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  );
};

Calendar.displayName = 'Calendar';

export default Calendar;
