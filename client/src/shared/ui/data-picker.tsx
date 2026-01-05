'use client';

import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/utils/cn';
import { CalendarMode } from '@/types/core/calendar/calendar';
import { format, startOfToday } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Calendar as CalendarIcon, CircleAlert } from 'lucide-react';
import { forwardRef, useState } from 'react';

type Props = {
  value?: Date | null;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  iconWithError?: boolean;
  calendarMode?: CalendarMode;
  className?: string;
};

export const DatePicker = forwardRef<HTMLButtonElement, Props>(
  (
    {
      value,
      onChange,
      placeholder = 'Оберіть дату',
      disabled,
      error,
      iconWithError = true,
      calendarMode = CalendarMode.YearsMonthsDays,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(() => value || new Date());
    const today = startOfToday();

    const handleOpenChange = (isOpen: boolean) => {
      if (isOpen && value) {
        setTempDate(value);
      } else if (isOpen) {
        setTempDate(new Date());
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              <CalendarIcon
                className={cn(
                  'mr-2 h-4 w-4 transition-all duration-200 ease-in-out text-muted',
                  isFocused && 'text-active-border',
                  error && 'text-red',
                )}
                aria-hidden="true"
              />
              {value ? format(value, 'dd MMMM yyyy', { locale: uk }) : <span>{placeholder}</span>}
              {error && iconWithError && <CircleAlert className="ml-auto text-red" />}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto p-0"
            align="start"
            onOpenAutoFocus={e => e.preventDefault()}
          >
            <form onSubmit={handleSubmit}>
              <Calendar
                date={tempDate}
                setDate={setTempDate}
                lang={uk}
                mode={calendarMode}
                maxDate={today}
              />
            </form>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
