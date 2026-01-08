'use client';

import { DatePicker } from '@/shared/ui/data-picker';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/utils/cn';
import { CalendarMode } from '@/types/core/calendar';
import { startOfToday } from 'date-fns';
import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  iconWithError?: boolean;
  className?: string;
  calendarMode?: CalendarMode;
  ariaRequired?: boolean;
};

export const RHFDatePicker = forwardRef<HTMLButtonElement, Props>(
  (
    {
      name,
      label,
      placeholder,
      disabled,
      iconWithError = true,
      className,
      calendarMode,
      ariaRequired = false,
    },
    ref,
  ) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const error = errors[name];
    const errorMessage = error?.message as string | undefined;
    const todaysDate = startOfToday();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={cn('flex flex-col gap-2', className)}>
            {label && (
              <Label htmlFor={name}>
                {label}
                {ariaRequired && <span className="text-red ml-1">*</span>}
              </Label>
            )}

            <DatePicker
              ref={ref}
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
              disabled={disabled}
              error={errorMessage}
              iconWithError={iconWithError}
              calendarMode={calendarMode}
              ariaRequired={ariaRequired}
              maxDate={todaysDate}
            />

            {errorMessage && (
              <div className="text-sm text-red" id={`${name}-error`}>
                {errorMessage}
              </div>
            )}
          </div>
        )}
      />
    );
  },
);

RHFDatePicker.displayName = 'RHFDatePicker';
