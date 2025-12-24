'use client';

import { forwardRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { format, startOfToday } from 'date-fns';
import { uk } from 'date-fns/locale';
import { CalendarRange as CalendarIcon } from 'lucide-react';

import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Label } from '@/shared/ui/label';

import { CalendarMode, DateRange } from '@/types/core/calendar';
import { CalendarRange } from '@/shared/ui/calendar';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  calendarMode?: CalendarMode;
}

export const RHFCalendarRange = forwardRef<HTMLButtonElement, Props>(
  (
    {
      name,
      label,
      placeholder = 'Оберіть період',
      disabled,
      className,
      calendarMode = CalendarMode.YearsMonthsDays,
    },
    ref,
  ) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const [open, setOpen] = useState(false);
    const today = startOfToday();

    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    const formatRange = (range: DateRange) =>
      `${format(range.from, 'dd.MM.yyyy')} – ${format(range.to, 'dd.MM.yyyy')}`;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const value: DateRange = field.value ?? { from: today, to: today };

          const handleOpenChange = (isOpen: boolean) => {
            setOpen(isOpen);
          };

          return (
            <div className={cn('flex flex-col gap-2', className)}>
              {label && <Label htmlFor={name}>{label}</Label>}

              <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                  <Button
                    ref={ref}
                    id={name}
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal !bg-bg-input',
                      !field.value && 'text-muted-foreground',
                      errorMessage && 'border-red focus-visible:ring-red',
                    )}
                    disabled={disabled}
                    aria-invalid={!!errorMessage}
                    aria-describedby={errorMessage ? `${name}-error` : undefined}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? formatRange(value) : <span>{placeholder}</span>}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                  onOpenAutoFocus={e => e.preventDefault()}
                >
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpen(false);
                    }}
                  >
                    <CalendarRange
                      date={value}
                      setDate={field.onChange}
                      lang={uk}
                      mode={calendarMode}
                    />
                  </form>
                </PopoverContent>
              </Popover>

              {errorMessage && (
                <div className="text-sm text-red" id={`${name}-error`}>
                  {errorMessage}
                </div>
              )}
            </div>
          );
        }}
      />
    );
  },
);

RHFCalendarRange.displayName = 'RHFCalendarRange';
