'use client';
import Calendar from '@/components/ui/calendar';
import { useState } from 'react';

export const CalendarComponent = () => {
  const [selectedDate, setSelectedDay] = useState(new Date());

  console.warn(selectedDate);

  return (
    <div>
      <Calendar onSelectedDate={date => setSelectedDay(date)} />
    </div>
  );
};
