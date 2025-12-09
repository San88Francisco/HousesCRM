'use client';

import { forwardRef, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Label } from '@/shared/ui/label';
import { CalendarMode } from '@/types/core/calendar';
import { Calendar } from '@/shared/ui/calendar';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  calendarMode?: CalendarMode;
}

export const RHFDatePicker = forwardRef<HTMLButtonElement, Props>(
  (
    {
      name,
      label,
      placeholder = 'Оберіть дату',
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
    const [tempDate, setTempDate] = useState<Date>(new Date());

    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const handleOpenChange = (isOpen: boolean) => {
            if (isOpen && field.value) {
              setTempDate(new Date(field.value));
            } else if (isOpen) {
              setTempDate(new Date());
            }
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
                      'w-full justify-start text-left font-normal bg-bg-input',
                      !field.value && 'text-muted-foreground',
                      errorMessage && 'border-red focus-visible:ring-red',
                    )}
                    disabled={disabled}
                    aria-invalid={!!errorMessage}
                    aria-describedby={errorMessage ? `${name}-error` : undefined}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(new Date(field.value), 'dd MMMM yyyy', { locale: uk })
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      field.onChange(format(tempDate, 'yyyy-MM-dd'));
                      setOpen(false);
                    }}
                  >
                    <Calendar date={tempDate} setDate={setTempDate} lang={uk} mode={calendarMode} />
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

RHFDatePicker.displayName = 'RHFDatePicker';
