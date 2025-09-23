'use client';
import Calendar from '@/components/ui/calendar';
import { CalendarMode, DateRange } from '@/types/core/calendar';
import { useState } from 'react';

export const CalendarComponent = () => {
  const [selectedRangeDate, setSelectedRangeDay] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedDate, setSelectedDay] = useState<Date>(new Date());

  console.warn(selectedRangeDate);
  console.warn(selectedDate);

  return (
    <div className="flex gap-10">
      <Calendar
        selectedDate={selectedRangeDate}
        mode={CalendarMode.Range}
        setSelectedDate={setSelectedRangeDay}
      />
      <Calendar
        selectedDate={selectedDate}
        mode={CalendarMode.Single}
        setSelectedDate={setSelectedDay}
      />
    </div>
  );
};
