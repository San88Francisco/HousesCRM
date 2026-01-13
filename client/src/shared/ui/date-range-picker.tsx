'use client';

import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/utils/cn';
import { CalendarMode } from '@/types/core/calendar';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Calendar as CalendarIcon, CircleAlert } from 'lucide-react';
import { forwardRef, useState } from 'react';

type Props = {
  id?: string;
  value?: Date | null;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  iconWithError?: boolean;
  calendarMode?: CalendarMode;
  className?: string;
  ariaRequired?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

export const DateRangePicker = forwardRef<HTMLButtonElement, Props>(
  (
    {
      id,
      value,
      onChange,
      placeholder = 'Оберіть дату',
      disabled,
      error,
      iconWithError = true,
      calendarMode = CalendarMode.YearsMonthsDays,
      className,
      ariaRequired = false,
      minDate,
      maxDate,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date());

    const handleOpenChange = (isOpen: boolean) => {
      if (isOpen) {
        setTempDate(value || new Date());
      }
      setOpen(isOpen);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange?.(tempDate);
      setOpen(false);
    };

    return (
      <div className={cn('relative', className)}>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              id={id}
              type="button"
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal h-10 px-2',
                'transition-all duration-200 ease-in-out',
                '!bg-bg-input rounded-lg border border-solid border-border',
                'text-sm',
                '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
                !value && 'text-muted-foreground',
                disabled && 'cursor-not-allowed opacity-50',
                isFocused && 'border-active-border',
                error && 'border-red text-red focus-visible:ring-red',
              )}
              disabled={disabled}
              aria-required={ariaRequired}
              aria-invalid={!!error}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              <CalendarIcon
                className={cn(
                  'transition-all duration-200 ease-in-out text-muted',
                  isFocused && 'text-active-border',
                  error && 'text-red',
                )}
                aria-hidden="true"
              />
              <span className={cn('line-clamp-1', !value && 'text-muted')}>
                {value ? format(value, 'dd MMMM yyyy', { locale: uk }) : placeholder}
              </span>
              {error && iconWithError && <CircleAlert className="ml-auto text-red" />}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <form onSubmit={handleSubmit}>
              <Calendar
                date={tempDate}
                setDate={setTempDate}
                lang={uk}
                mode={calendarMode}
                minDate={minDate}
                maxDate={maxDate}
              />
            </form>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

DateRangePicker.displayName = 'DateRangePicker';
