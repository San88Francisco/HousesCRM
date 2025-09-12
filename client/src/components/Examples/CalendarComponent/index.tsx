'use client';
// import Calendar, { CalendarMode } from '@/components/ui/calendar';
// import { useState } from 'react';

// export const CalendarComponent = () => {
//   const [selectedDate, setSelectedDay] = useState<Date>(new Date());
//   // const [selectedDate, setSelectedDay] = useState<DateRange>({
//   //   startDate: new Date(),
//   //   endDate: new Date(),
//   // });

//   console.warn(selectedDate);

//   return (
//     <div>
//       <Calendar
//         selectedDate={selectedDate}
//         mode={CalendarMode.Single}
//         setSelectedDate={setSelectedDay}
//       />
//     </div>
//   );
// };

import Calendar, { CalendarMode, DateRange } from '@/components/ui/calendar';
import { useState } from 'react';

export const CalendarComponent = () => {
  const [selectedDate, setSelectedDay] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });

  console.warn(selectedDate);

  return (
    <div>
      <Calendar
        selectedDate={selectedDate}
        mode={CalendarMode.Range}
        setSelectedDate={setSelectedDay}
      />
    </div>
  );
};
