'use client';

import { Calendar, CalendarRange } from '@/components/ui/calendar';
import { DateRange } from '@/types/core/calendar';
import { format, startOfToday } from 'date-fns';
import { useState } from 'react';

export const CalendarComponent = () => {
  const [selectedRangeDate, setSelectedRangeDay] = useState<DateRange>({
    from: startOfToday(),
    to: startOfToday(),
  });
  const [selectedDate, setSelectedDay] = useState<Date>(startOfToday());

  return (
    <div className="flex gap-10">
      <div>
        <Calendar date={selectedDate} setDate={setSelectedDay} />
        {format(selectedDate, 'dd-MM-yyyy')}
      </div>
      <div>
        <CalendarRange date={selectedRangeDate} setDate={setSelectedRangeDay} />
        {format(selectedRangeDate.from, 'dd-MM-yyyy')}-{format(selectedRangeDate.to, 'dd-MM-yyyy')}
      </div>
    </div>
  );
};

// ? multilanguage
// ? styles
