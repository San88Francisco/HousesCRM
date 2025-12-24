'use client';

import { forwardRef, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { format, startOfToday } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Label } from '@/shared/ui/label';
import { CalendarMode } from '@/types/core/calendar';
import CalendarDisplay from '@/shared/ui/calendar/ui/calendar-display';

interface Props {
  nameFrom: string;
  nameTo: string;
  labelFrom?: string;
  labelTo?: string;
  placeholderFrom?: string;
  placeholderTo?: string;
  disabled?: boolean;
  className?: string;
  calendarMode?: CalendarMode;
}

export const RHFDateRangePicker = forwardRef<HTMLDivElement, Props>(
  (
    {
      nameFrom,
      nameTo,
      labelFrom,
      labelTo,
      placeholderFrom = 'Оберіть дату',
      placeholderTo = 'Оберіть дату',
      disabled,
      className,
      calendarMode = CalendarMode.YearsMonthsDays,
    },
    ref,
  ) => {
    const {
      control,
      formState: { errors },
      watch,
    } = useFormContext();

    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const [tempDateFrom, setTempDateFrom] = useState<Date>(startOfToday());
    const [tempDateTo, setTempDateTo] = useState<Date>(startOfToday());

    const today = startOfToday();

    // Спостерігаємо за значеннями обох полів для синхронізації
    const watchedFrom = watch(nameFrom);
    const watchedTo = watch(nameTo);

    const errorFrom = errors[nameFrom];
    const errorTo = errors[nameTo];
    const errorMessageFrom = errorFrom?.message as string | undefined;
    const errorMessageTo = errorTo?.message as string | undefined;

    return (
      <div ref={ref} className={cn('flex flex-col gap-4', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date From Field */}
          <Controller
            name={nameFrom}
            control={control}
            render={({ field: fieldFrom }) => {
              const handleOpenChangeFrom = (isOpen: boolean) => {
                if (isOpen) {
                  setTempDateFrom(fieldFrom.value ? new Date(fieldFrom.value) : today);
                }
                setOpenFrom(isOpen);
              };

              const handleSubmitFrom = (e: React.FormEvent) => {
                e.preventDefault();
                e.stopPropagation();
                fieldFrom.onChange(tempDateFrom.toISOString());
                setOpenFrom(false);
              };

              const handleCancelFrom = () => {
                setTempDateFrom(fieldFrom.value ? new Date(fieldFrom.value) : today);
                setOpenFrom(false);
              };

              return (
                <div className="flex flex-col gap-2">
                  {labelFrom && <Label htmlFor={nameFrom}>{labelFrom}</Label>}

                  <Popover open={openFrom} onOpenChange={handleOpenChangeFrom}>
                    <PopoverTrigger asChild>
                      <Button
                        id={nameFrom}
                        type="button"
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal !bg-bg-input',
                          !fieldFrom.value && 'text-muted-foreground',
                          errorMessageFrom && 'border-red focus-visible:ring-red',
                        )}
                        disabled={disabled}
                        aria-invalid={!!errorMessageFrom}
                        aria-describedby={errorMessageFrom ? `${nameFrom}-error` : undefined}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fieldFrom.value ? (
                          format(new Date(fieldFrom.value), 'dd MMMM yyyy', { locale: uk })
                        ) : (
                          <span>{placeholderFrom}</span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                      onOpenAutoFocus={e => e.preventDefault()}
                    >
                      <form onSubmit={handleSubmitFrom}>
                        <div className="bg-background dark:bg-foreground rounded-lg shadow-lg p-4">
                          <CalendarDisplay
                            firstWeekDayNumber={1}
                            date={tempDateFrom}
                            setDate={setTempDateFrom}
                            maxDate={watchedTo ? new Date(watchedTo) : undefined}
                            lang={uk}
                            mode={calendarMode}
                          />
                          <div className="flex gap-2 mt-4">
                            <Button type="submit" variant="default" className="w-full">
                              Ok
                            </Button>
                            <Button
                              type="button"
                              onClick={handleCancelFrom}
                              variant="outline"
                              className="w-full"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>
                    </PopoverContent>
                  </Popover>

                  {errorMessageFrom && (
                    <div className="text-sm text-red" id={`${nameFrom}-error`}>
                      {errorMessageFrom}
                    </div>
                  )}
                </div>
              );
            }}
          />

          {/* Date To Field */}
          <Controller
            name={nameTo}
            control={control}
            render={({ field: fieldTo }) => {
              const handleOpenChangeTo = (isOpen: boolean) => {
                if (isOpen) {
                  setTempDateTo(fieldTo.value ? new Date(fieldTo.value) : today);
                }
                setOpenTo(isOpen);
              };

              const handleSubmitTo = (e: React.FormEvent) => {
                e.preventDefault();
                e.stopPropagation();
                fieldTo.onChange(tempDateTo.toISOString());
                setOpenTo(false);
              };

              const handleCancelTo = () => {
                setTempDateTo(fieldTo.value ? new Date(fieldTo.value) : today);
                setOpenTo(false);
              };

              return (
                <div className="flex flex-col gap-2">
                  {labelTo && <Label htmlFor={nameTo}>{labelTo}</Label>}

                  <Popover open={openTo} onOpenChange={handleOpenChangeTo}>
                    <PopoverTrigger asChild>
                      <Button
                        id={nameTo}
                        type="button"
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal !bg-bg-input',
                          !fieldTo.value && 'text-muted-foreground',
                          errorMessageTo && 'border-red focus-visible:ring-red',
                        )}
                        disabled={disabled}
                        aria-invalid={!!errorMessageTo}
                        aria-describedby={errorMessageTo ? `${nameTo}-error` : undefined}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fieldTo.value ? (
                          format(new Date(fieldTo.value), 'dd MMMM yyyy', { locale: uk })
                        ) : (
                          <span>{placeholderTo}</span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                      onOpenAutoFocus={e => e.preventDefault()}
                    >
                      <form onSubmit={handleSubmitTo}>
                        <div className="bg-background dark:bg-foreground rounded-lg shadow-lg p-4">
                          <CalendarDisplay
                            firstWeekDayNumber={1}
                            date={tempDateTo}
                            setDate={setTempDateTo}
                            minDate={watchedFrom ? new Date(watchedFrom) : undefined}
                            lang={uk}
                            mode={calendarMode}
                          />
                          <div className="flex gap-2 mt-4">
                            <Button type="submit" variant="default" className="w-full">
                              Ok
                            </Button>
                            <Button
                              type="button"
                              onClick={handleCancelTo}
                              variant="outline"
                              className="w-full"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>
                    </PopoverContent>
                  </Popover>

                  {errorMessageTo && (
                    <div className="text-sm text-red" id={`${nameTo}-error`}>
                      {errorMessageTo}
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>
    );
  },
);

RHFDateRangePicker.displayName = 'RHFDateRangePicker';
