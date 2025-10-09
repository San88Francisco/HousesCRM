'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onValueChange?: (checked: boolean) => void;
}

export const RHFSwitch = forwardRef<HTMLButtonElement, Props>(
  ({ name, label, disabled, className, onValueChange }, ref) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={cn('flex items-center space-x-2', className)}>
            <Switch
              id={name}
              checked={field.value}
              onCheckedChange={checked => {
                field.onChange(checked);
                onValueChange?.(checked);
              }}
              disabled={disabled}
              ref={ref}
            />
            {label && (
              <Label htmlFor={name} className="text-sm font-medium cursor-pointer">
                {label}
              </Label>
            )}
          </div>
        )}
      />
    );
  },
);

RHFSwitch.displayName = 'RHFSwitch';
