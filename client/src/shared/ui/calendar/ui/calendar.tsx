import { Day, Locale, startOfToday } from 'date-fns';
import { FC, useEffect } from 'react';
import CalendarDisplay from './calendar-display';
import { Button } from '../../button';
import { CalendarMode } from '@/types/core/calendar';

interface ICalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  firstWeekDayNumber?: Day;
  lang: Locale;
  mode?: CalendarMode;
}

const Calendar: FC<ICalendarProps> = ({
  date,
  setDate,
  firstWeekDayNumber = 1,
  lang,
  mode = CalendarMode.YearsMonthsDays,
}) => {
  const today = startOfToday();
  useEffect(() => {
    setDate(today);
  }, []);

  const handleCancel = () => {
    setDate(today);
  };

  return (
    <div className="bg-background dark:bg-foreground rounded-lg shadow-lg p-4">
      <CalendarDisplay
        firstWeekDayNumber={firstWeekDayNumber}
        date={date}
        setDate={setDate}
        lang={lang}
        mode={mode}
      />
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

export default Calendar;
