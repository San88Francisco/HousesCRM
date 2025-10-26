import { CalendarMode, DateRange } from '@/types/core/calendar';
import { Day, Locale, startOfToday } from 'date-fns';
import { FC, useEffect, useState } from 'react';
import CalendarDisplay from './calendar-display';
import { Button } from '../../button';

interface ICalendarRangeProps {
  date: DateRange;
  setDate: (range: DateRange) => void;
  firstWeekDayNumber?: Day;
  lang: Locale;
  mode?: CalendarMode;
}

const CalendarRange: FC<ICalendarRangeProps> = ({
  date,
  setDate,
  firstWeekDayNumber = 1,
  lang,
  mode = CalendarMode.YearsMonthsDays,
}) => {
  const today = startOfToday();

  const [startDate, setStartDate] = useState<Date>(date.from);
  const [endDate, setEndDate] = useState<Date>(date.to);

  useEffect(() => {
    setStartDate(date.from);
    setEndDate(date.to);
  }, []);

  useEffect(() => {
    setDate({ from: startDate, to: endDate });
  }, [startDate, endDate]);

  const handleCancel = () => {
    setDate({ from: today, to: today });
    setStartDate(today);
    setEndDate(today);
  };

  return (
    <div className="bg-background dark:bg-foreground rounded-lg shadow-lg p-4">
      <div className="flex gap-8">
        <CalendarDisplay
          firstWeekDayNumber={firstWeekDayNumber}
          date={startDate}
          setDate={setStartDate}
          maxDate={endDate}
          lang={lang}
          mode={mode}
        />
        <CalendarDisplay
          firstWeekDayNumber={firstWeekDayNumber}
          date={endDate}
          setDate={setEndDate}
          minDate={startDate}
          lang={lang}
          mode={mode}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="default" className="w-full">
          Ok
        </Button>
        <Button onClick={handleCancel} variant="outline" className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CalendarRange;
