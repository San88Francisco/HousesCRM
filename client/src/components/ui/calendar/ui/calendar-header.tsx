import { viewModeType } from '@/types/core/calendar';
import { format, getYear } from 'date-fns';
import { MoveLeft, MoveRight } from 'lucide-react';
import { FC, Fragment } from 'react';

interface ICalendarHeaderProps {
  handlePrevPage: () => void;
  handleNextPage: () => void;
  setViewMode: (viewMode: viewModeType) => void;
  calendarYears: Date[];
  currentYear: Date;
  firstDayCurrentMonth: Date;
  viewMode: viewModeType;
}

const CalendarHeader: FC<ICalendarHeaderProps> = ({
  handlePrevPage,
  handleNextPage,
  setViewMode,
  calendarYears,
  currentYear,
  viewMode,
  firstDayCurrentMonth,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <button onClick={handlePrevPage} className="p-1 hover:bg-gray-100 rounded">
        <MoveLeft className="w-5 h-5 text-gray-600" />
      </button>

      <h2 className="text-lg font-bold font-medium text-gray-900 flex gap-2">
        {viewMode === 'days' && (
          <Fragment>
            <button onClick={() => setViewMode('months')}>
              {format(firstDayCurrentMonth, 'MMMM')}
            </button>
            <button onClick={() => setViewMode('years')}>
              {format(firstDayCurrentMonth, 'yyyy')}
            </button>
          </Fragment>
        )}
        {viewMode === 'years' && (
          <button onClick={() => setViewMode('days')}>
            {getYear(calendarYears[0])}-{getYear(calendarYears[calendarYears.length - 1])}
          </button>
        )}
        {viewMode === 'months' && (
          <button onClick={() => setViewMode('years')}>{format(currentYear, 'yyyy')}</button>
        )}
      </h2>
      <button onClick={handleNextPage} className="p-1 hover:bg-gray-100 rounded">
        <MoveRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default CalendarHeader;
