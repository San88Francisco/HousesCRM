import { CalendarMode, LevelType } from '@/types/core/calendar/calendar';
import { format, getYear, Locale } from 'date-fns';
import { MoveLeft, MoveRight } from 'lucide-react';
import { FC, Fragment } from 'react';

interface ICalendarHeaderProps {
  handlePrevPage: () => void;
  handleNextPage: () => void;
  calendarYears: Date[];
  currentYear: Date;
  firstDayCurrentMonth: Date;
  mode: CalendarMode;
  level: LevelType;
  setLevel: (level: LevelType) => void;
  lang: Locale;
}

const CalendarHeader: FC<ICalendarHeaderProps> = ({
  handlePrevPage,
  handleNextPage,
  calendarYears,
  currentYear,
  firstDayCurrentMonth,
  mode,
  level,
  setLevel,
  lang,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        type="button"
        onClick={handlePrevPage}
        className="p-1 hover:bg-dark-lightest rounded dark:hover:text-dark"
      >
        <MoveLeft className="w-5 h-5 text-gray-600" />
      </button>

      <h2 className="text-lg font-medium text-gray-900 flex gap-2">
        {level === 'days' && (
          <Fragment>
            <button type="button" onClick={() => setLevel('months')}>
              {format(firstDayCurrentMonth, 'MMMM', { locale: lang })}
            </button>
            <button type="button" onClick={() => setLevel('years')}>
              {format(firstDayCurrentMonth, 'yyyy', { locale: lang })}
            </button>
          </Fragment>
        )}
        {level === 'months' && (
          <button type="button" onClick={() => setLevel('years')}>
            {format(currentYear, 'yyyy', { locale: lang })}
          </button>
        )}
        {level === 'years' && (
          <button
            type="button"
            onClick={() =>
              setLevel(
                mode === CalendarMode.YearsMonthsDays
                  ? 'days'
                  : mode === CalendarMode.YearsMonths
                    ? 'months'
                    : 'years',
              )
            }
          >
            {getYear(calendarYears[0])}-{getYear(calendarYears[calendarYears.length - 1])}
          </button>
        )}
      </h2>
      <button
        type="button"
        onClick={handleNextPage}
        className="p-1 hover:bg-dark-lightest rounded dark:hover:text-dark"
      >
        <MoveRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default CalendarHeader;
