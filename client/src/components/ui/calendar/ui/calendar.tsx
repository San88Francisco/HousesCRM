'use client';
import { Day } from 'date-fns';
import { FC, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarMode, DateRange } from '@/types/core/calendar';
import { useCalendarState } from '@/hooks/CalendarHooks/use-calendar-state';
import { useCalendarNavigation } from '@/hooks/CalendarHooks/use-calendar-navigation';
import CalendarHeader from './calendar-header';
import CalendarDaysView from './calendar-days-view';
import CalendarYearsView from './calendar-years-view';
import CalendarMonthsView from './calendar-months-view';

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
    calendarMonths,
    currentYear,
    setCurrentYear,
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
    currentYear,
    setCurrentMonth,
    setCurrentDecadeStart,
    setCurrentYear,
  });

  // todo optimize
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

  // todo change render of weeks days names
  // todo change page to the peaked year date
  return (
    <div className="w-80 bg-background rounded-lg shadow-lg p-4">
      <CalendarHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        firstDayCurrentMonth={firstDayCurrentMonth}
        currentYear={currentYear}
        calendarYears={calendarYears}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
      {viewMode === 'days' && (
        <CalendarDaysView
          mode={mode}
          calendarDays={calendarDays}
          selectedDate={selectedDate}
          hoveredDate={hoveredDate}
          firstDayCurrentMonth={firstDayCurrentMonth}
          handleSelect={handleSelect}
          handleHover={handleHover}
        />
      )}
      {viewMode === 'months' && (
        <CalendarMonthsView
          mode={mode}
          calendarMonths={calendarMonths}
          selectedDate={selectedDate}
          hoveredDate={hoveredDate}
          handleSelect={handleSelect}
          handleHover={handleHover}
        />
      )}
      {viewMode === 'years' && (
        <CalendarYearsView
          mode={mode}
          calendarYears={calendarYears}
          selectedDate={selectedDate}
          hoveredDate={hoveredDate}
          handleSelect={handleSelect}
          handleHover={handleHover}
        />
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
