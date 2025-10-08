import { Day, Locale, startOfToday } from 'date-fns';
import { FC, useEffect } from 'react';
import CalendarDisplay from './calendar-display';
import { Button } from '../../button';

interface ICalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  firstWeekDayNumber?: Day;
  lang: Locale;
}

const Calendar: FC<ICalendarProps> = ({ date, setDate, firstWeekDayNumber = 1, lang }) => {
  const today = startOfToday();
  useEffect(() => {
    setDate(today);
  }, []);

  const handleCancel = () => {
    setDate(today);
  };

  return (
    <div className="bg-background rounded-lg shadow-lg p-4">
      <CalendarDisplay
        firstWeekDayNumber={firstWeekDayNumber}
        date={date}
        setDate={setDate}
        lang={lang}
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
