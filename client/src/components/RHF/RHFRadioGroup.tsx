'use client';

import { forwardRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface Props {
  name: string;
  options: RadioOption[];
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  onValueChange?: (value: string) => void;
}

export const RHFRadioGroup = forwardRef<HTMLDivElement, Props>(
  ({ name, options, label, disabled, className, orientation = 'vertical', onValueChange }, ref) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className={cn('space-y-2', className)} ref={ref}>
            {label && (
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
              </label>
            )}
            <RadioGroup
              value={field.value}
              onValueChange={value => {
                field.onChange(value);
                onValueChange?.(value);
              }}
              disabled={disabled}
              className={cn(orientation === 'horizontal' && 'flex flex-row space-x-4')}
            >
              {options.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${name}-${option.value}`}
                    disabled={option.disabled || disabled}
                  />
                  <label
                    htmlFor={`${name}-${option.value}`}
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
            {error && <p className="text-sm font-medium text-red">{error.message}</p>}
          </div>
        )}
      />
    );
  },
);

RHFRadioGroup.displayName = 'RHFRadioGroup';
