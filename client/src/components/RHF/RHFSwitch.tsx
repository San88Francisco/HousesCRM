'use client';

import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { cn } from '@/shared/utils/cn';
import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
  onValueChange?: (checked: boolean) => void;
}

export const RHFSwitch = ({ name, label, disabled, className, onValueChange }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cn('flex items-center space-x-2', className)}>
          <Switch
            id={name}
            checked={!!field.value}
            onCheckedChange={checked => {
              field.onChange(checked);
              onValueChange?.(checked);
            }}
            disabled={disabled}
            ref={field.ref}
            onBlur={field.onBlur}
          />
          {label && (
            <Label htmlFor={name} className="cursor-pointer text-text font-medium">
              {label}
            </Label>
          )}
        </div>
      )}
    />
  );
};
