'use client';

import { Calendar, CalendarRange } from '@/shared/ui/calendar';
import { CalendarMode, DateRange } from '@/types/core/calendar/calendar';
import { format, startOfToday } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import { useState } from 'react';

export const CalendarComponent = () => {
  const [selectedRangeDate, setSelectedRangeDay] = useState<DateRange>({
    from: startOfToday(),
    to: startOfToday(),
  });
  const [selectedDate, setSelectedDay] = useState<Date>(startOfToday());

  return (
    <div className="flex gap-10">
      <>
        <Calendar
          date={selectedDate}
          setDate={setSelectedDay}
          lang={enUS}
          mode={CalendarMode.YearsMonths}
        />
        {format(selectedDate, 'dd-MM-yyyy')}
      </>
      <>
        <CalendarRange date={selectedRangeDate} setDate={setSelectedRangeDay} lang={uk} />
        {format(selectedRangeDate.from, 'dd-MM-yyyy')}-{format(selectedRangeDate.to, 'dd-MM-yyyy')}
      </>
    </div>
  );
};
