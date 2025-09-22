'use client';
import { cn } from '@/lib/utils';
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
import { Button } from '@/components/ui/button';
import { CalendarMode, DateRange } from '@/types/core/calendar';
import { useCalendarState } from '@/hooks/CalendarHooks/use-calendar-state';
import { useCalendarNavigation } from '@/hooks/CalendarHooks/use-calendar-navigation';
import CalendarHeader from './calendar-header';
import CalendarCell from './calendar-cell';

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
    firstDayCurrentMonth,
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
    firstDayCurrentMonth,
    currentDecadeStart,
    setCurrentMonth,
    setCurrentDecadeStart,
  });

  // todo make separate hook
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

  const base =
    'w-full rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest';

  const currentDateStyle =
    'border border-solid border-active-border text-active-border hover:border-blue-dark hover:text-blue-dark hover:bg-[#dbeafe]';

  // todo change render of weeks days names
  // todo change page to the peaked year date
  return (
    <div className="w-80 bg-background rounded-lg shadow-lg p-4">
      <CalendarHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        firstDayCurrentMonth={firstDayCurrentMonth}
        calendarYears={calendarYears}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
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
                  <CalendarCell
                    key={day.toString()}
                    dateTime={format(day, 'yyyy-MM-dd')}
                    onClick={() => handleSelect(day)}
                    size="small"
                    isOutOfPeriod={!isSameMonth(day, firstDayCurrentMonth)}
                    isCurrentDate={isToday(day)}
                    isSelected={isEqual(day, selectedDate)}
                  >
                    {format(day, 'd')}
                  </CalendarCell>
                  // <time
                  //   key={day.toString()}
                  //   dateTime={format(day, 'yyyy-MM-dd')}
                  //   onClick={() => handleSelect(day)}
                  //   className={cn(
                  //     `h-[2.125rem] ${base}`,
                  //     // 'h-[2.125rem] w-full rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                  //     !isSameMonth(day, firstDayCurrentMonth) && 'text-dark-medium',
                  //     isToday(day) && currentDateStyle,
                  //     isEqual(day, selectedDate) &&
                  //       'bg-active-border text-white hover:text-white hover:bg-blue-dark',
                  //   )}
                  // >
                  //   {format(day, 'd')}
                  // </time>
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
                  // <time
                  //   key={day.toString()}
                  //   dateTime={format(day, 'yyyy-MM-dd')}
                  //   onClick={() => handleSelect(day)}
                  //   onMouseEnter={() => handleHover(day)}
                  //   className={cn(
                  //     `h-[2.125rem] ${base}`,
                  //     // 'h-[2.125rem] w-full rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                  //     !isSameMonth(day, firstDayCurrentMonth) && 'text-dark-medium',
                  //     isToday(day) && currentDateStyle,
                  //     inRange && 'bg-dark-lightest rounded-[0]',
                  //     isEqual(day, rangeStart) &&
                  //       'rounded-l-[0.75rem] bg-active-border text-white hover:text-white hover:bg-blue-dark',
                  //     isEqual(day, rangeEnd) &&
                  //       'rounded-r-[0.75rem] bg-active-border text-white hover:text-white hover:bg-blue-dark',
                  //   )}
                  // >
                  //   {format(day, 'd')}
                  // </time>
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
      )}
      {viewMode === 'years' && (
        <div className="grid grid-cols-3 gap-y-3 mb-6 place-items-center">
          {calendarYears.map(year => {
            if (mode === CalendarMode.Single) {
              return (
                // <time
                //   key={year.toString()}
                //   dateTime={format(year, 'yyyy-MM-dd')}
                //   onClick={() => setSelectedDate(year)}
                //   className={cn(
                //     `h-[2.5rem] ${base}`,
                //     // 'h-[2.5rem] w-full rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                //     // !isSameYear(year, firstDayCurrentMonth) && 'text-dark-medium',
                //     isThisYear(year) && currentDateStyle,
                //     isSameYear(year, selectedDate) &&
                //       'bg-active-border text-white hover:text-white hover:bg-blue-dark',
                //   )}
                // >
                //   {format(year, 'y')}
                // </time>
                <CalendarCell
                  key={year.toString()}
                  dateTime={format(year, 'yyyy-MM-dd')}
                  onClick={() => setSelectedDate(year)}
                  size="big"
                  isCurrentDate={isThisYear(year)}
                  isSelected={isSameYear(year, selectedDate)}
                >
                  {format(year, 'y')}
                </CalendarCell>
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
                // <time
                //   key={year.toString()}
                //   dateTime={format(year, 'yyyy-MM-dd')}
                //   onClick={() => handleSelect(year)}
                //   onMouseEnter={() => handleHover(year)}
                //   className={cn(
                //     `h-[2.5rem] ${base}`,
                //     // 'h-[2.5rem] w-full rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest',
                //     // !isSameYear(year, firstDayCurrentMonth) && 'text-dark-medium',
                //     isThisYear(year) && currentDateStyle,
                //     inRange && 'bg-dark-lightest rounded-[0]',
                //     isSameYear(year, rangeStart) &&
                //       'rounded-l-[0.75rem] bg-active-border text-white hover:text-white hover:bg-blue-dark',
                //     isSameYear(year, rangeEnd) &&
                //       'rounded-r-[0.75rem] bg-active-border text-white hover:text-white hover:bg-blue-dark',
                //   )}
                // >
                //   {format(year, 'y')}
                // </time>
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
