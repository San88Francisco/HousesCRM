'use client';

import { DateRangePicker } from '@/shared/ui/date-range-picker';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/utils/cn';
import { CalendarMode } from '@/types/core/calendar';
import { forwardRef } from 'react';
import { Controller, get, useFormContext } from 'react-hook-form';

type Props = {
  id?: string;
  startName: string;
  endName: string;
  startLabel?: string;
  endLabel?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  calendarMode?: CalendarMode;
  ariaRequired?: boolean;
};

export const RHFDateRangePicker = forwardRef<HTMLDivElement, Props>(
  (
    {
      startName,
      endName,
      startLabel,
      endLabel,
      startPlaceholder = 'Дата початку',
      endPlaceholder = 'Дата завершення',
      disabled,
      className,
      calendarMode = CalendarMode.YearsMonthsDays,
      ariaRequired = false,
    },
    ref,
  ) => {
    const {
      control,
      formState: { errors },
      watch,
    } = useFormContext();

    const startError = get(errors, startName);
    const endError = get(errors, endName);
    const startErrorMessage = startError?.message as string | undefined;
    const endErrorMessage = endError?.message as string | undefined;

    const startDate = watch(startName);
    const endDate = watch(endName);

    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <Controller
            name={startName}
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {startLabel && (
                  <Label htmlFor={startName} className="text-text font-medium">
                    {startLabel}
                    {ariaRequired && <span className="text-red ml-1">*</span>}
                  </Label>
                )}

                <DateRangePicker
                  id={startName}
                  value={field.value}
                  onChange={date => {
                    field.onChange(date);
                  }}
                  placeholder={startPlaceholder}
                  disabled={disabled}
                  error={startErrorMessage}
                  calendarMode={calendarMode}
                  ariaRequired={ariaRequired}
                  maxDate={endDate}
                />

                {startErrorMessage && (
                  <div className="text-sm text-red" id={`${startName}-error`}>
                    {startErrorMessage}
                  </div>
                )}
              </div>
            )}
          />

          {/* End Date */}
          <Controller
            name={endName}
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                {endLabel && (
                  <Label htmlFor={endName} className="text-text font-medium">
                    {endLabel}
                    {ariaRequired && <span className="text-red ml-1">*</span>}
                  </Label>
                )}

                <DateRangePicker
                  id={endName}
                  value={field.value}
                  onChange={date => {
                    field.onChange(date);
                  }}
                  placeholder={endPlaceholder}
                  disabled={disabled}
                  error={endErrorMessage}
                  calendarMode={calendarMode}
                  ariaRequired={ariaRequired}
                  minDate={startDate}
                />

                {endErrorMessage && (
                  <div className="text-sm text-red" id={`${endName}-error`}>
                    {endErrorMessage}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
    );
  },
);

RHFDateRangePicker.displayName = 'RHFDateRangePicker';
