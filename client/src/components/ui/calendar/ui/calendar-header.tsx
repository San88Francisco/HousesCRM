import { levelType } from '@/types/core/calendar';
import { format, getYear } from 'date-fns';
import { MoveLeft, MoveRight } from 'lucide-react';
import { FC, Fragment } from 'react';

interface ICalendarHeaderProps {
  handlePrevPage: () => void;
  handleNextPage: () => void;
  calendarYears: Date[];
  currentYear: Date;
  firstDayCurrentMonth: Date;
  level: levelType;
  setLevel: (level: levelType) => void;
}

const CalendarHeader: FC<ICalendarHeaderProps> = ({
  handlePrevPage,
  handleNextPage,
  calendarYears,
  currentYear,
  firstDayCurrentMonth,
  level,
  setLevel,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <button onClick={handlePrevPage} className="p-1 hover:bg-gray-100 rounded">
        <MoveLeft className="w-5 h-5 text-gray-600" />
      </button>

      <h2 className="text-lg font-bold font-medium text-gray-900 flex gap-2">
        {level === 'days' && (
          <Fragment>
            <button onClick={() => setLevel('months')}>
              {format(firstDayCurrentMonth, 'MMMM')}
            </button>
            <button onClick={() => setLevel('years')}>
              {format(firstDayCurrentMonth, 'yyyy')}
            </button>
          </Fragment>
        )}
        {level === 'months' && (
          <button onClick={() => setLevel('years')}>{format(currentYear, 'yyyy')}</button>
        )}
        {level === 'years' && (
          <button onClick={() => setLevel('days')}>
            {getYear(calendarYears[0])}-{getYear(calendarYears[calendarYears.length - 1])}
          </button>
        )}
      </h2>
      <button onClick={handleNextPage} className="p-1 hover:bg-gray-100 rounded">
        <MoveRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default CalendarHeader;
