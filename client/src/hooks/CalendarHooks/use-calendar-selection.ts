// 'use client';

// import { CalendarMode, DateRange } from '@/types/core/calendar';

// type SingleUseCalendarSelectionProps = {
//   today: Date;
//   selectedDate: Date;
//   setHoveredDate: (date: DateRange) => void;
//   setSelectedDate: (date: Date) => void;
// };

// type RangeUseCalendarSelectionProps = {
//   today: Date;
//   selectedDate: DateRange;
//   setHoveredDate: (date: DateRange) => void;
//   setSelectedDate: (dateRange: DateRange) => void;
// };

// type useCalendarSelectionProps =
//   | ({ mode: CalendarMode.Single } & SingleUseCalendarSelectionProps)
//   | ({ mode: CalendarMode.Range } & RangeUseCalendarSelectionProps);

// // type useCalendarSelectionProps = {
// //   today: Date;
// //   mode: CalendarMode;
// //   selectedDate: Date | DateRange;
// //   setSelectedDate: (date: Date | DateRange) => void;
// //   setHoveredDate: (range: DateRange) => void;
// // };

// export const useCalendarSelection = ({
//   today,
//   mode,
//   selectedDate,
//   setSelectedDate,
//   setHoveredDate,
// }: useCalendarSelectionProps) => {
//   const handleSelect = (date: Date) => {
//     if (mode === CalendarMode.Single) {
//       setSelectedDate(date);
//       return;
//     }

//     if (mode === CalendarMode.Range) {
//       const { startDate, endDate } = selectedDate as DateRange;

//       if (startDate !== endDate) {
//         setSelectedDate({ startDate: date, endDate: date });
//         setHoveredDate({
//           startDate: date,
//           endDate: date,
//         });
//       } else if (startDate > date) {
//         const savedState = startDate;
//         setSelectedDate({
//           startDate: date,
//           endDate: savedState,
//         });
//       } else {
//         const savedState = startDate;
//         setSelectedDate({
//           startDate: savedState,
//           endDate: date,
//         });
//       }
//     }
//   };

//   const handleHover = (date: Date) => {
//     if (mode !== CalendarMode.Range) {
//       return;
//     }

//     const { startDate, endDate } = selectedDate as DateRange;

//     if (!startDate) {
//       return;
//     }
//     if (endDate && startDate !== endDate) {
//       return;
//     }

//     setHoveredDate({
//       startDate: startDate < date ? startDate : date,
//       endDate: startDate < date ? date : startDate,
//     });
//   };

//   const handleCancel = () => {
//     if (mode === CalendarMode.Single) {
//       setSelectedDate(today);
//     }
//     if (mode === CalendarMode.Range) {
//       setSelectedDate({
//         startDate: today,
//         endDate: today,
//       });
//       setHoveredDate({
//         startDate: today,
//         endDate: today,
//       });
//     }
//   };

//   return {
//     handleSelect,
//     handleHover,
//     handleCancel,
//   };
// };
