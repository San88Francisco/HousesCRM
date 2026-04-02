'use client';

import { Button } from '@/shared/ui/button';
import Calendar from '@/shared/ui/calendar/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/utils/cn';
import { CalendarMode } from '@/types/core/calendar';
import { format, Locale } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Calendar as CalendarIcon, CircleAlert } from 'lucide-react';
import { forwardRef, useState } from 'react';

type Props = {
  id?: string;
  locale?: Locale;
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
      locale = uk,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
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
                'bg-bg-input rounded-lg border border-solid border-border',
                'text-sm hover:bg-bg-input active:!bg-bg-input focus:!bg-bg-input focus-visible:!bg-bg-input',
                'focus-visible:outline-none focus-visible:ring-0',
                '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
                disabled && 'cursor-not-allowed opacity-50',
                !open &&
                  'border-border active:!border-border focus:!border-border focus-visible:!border-border',
                open &&
                  'border-active-border active:!border-active-border focus:!border-active-border focus-visible:!border-active-border',
                error && 'border-red text-red focus-visible:ring-red',
              )}
              disabled={disabled}
              aria-required={ariaRequired}
              aria-invalid={!!error}
            >
              <CalendarIcon
                className={cn(
                  'transition-all duration-200 ease-in-out text-muted',
                  open && 'text-active-border',
                  error && 'text-red',
                )}
                aria-hidden="true"
              />
              <span className={cn('line-clamp-1', !value && 'text-muted-text')}>
                {value ? format(value, 'dd MMMM yyyy', { locale }) : placeholder}
              </span>
              {error && iconWithError && <CircleAlert className="ml-auto text-red" />}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <form onSubmit={handleSubmit}>
              <Calendar
                date={tempDate}
                setDate={setTempDate}
                lang={locale}
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
