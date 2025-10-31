'use client';

import { CalendarMode, DateRange } from '@/types/core/calendar';
import { format, startOfToday } from 'date-fns';
import { useState } from 'react';
import { uk, enUS } from 'date-fns/locale';
import { Calendar, CalendarRange } from '@/shared/ui/calendar';

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
