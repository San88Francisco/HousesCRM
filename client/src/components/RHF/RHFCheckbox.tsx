'use client';

import { forwardRef, ReactNode } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import type { checkboxVariants } from '@/components/ui/checkbox';

interface Props extends VariantProps<typeof checkboxVariants> {
  name: string;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
  onValueChange?: (checked: boolean) => void;
}

const RHFCheckbox = forwardRef<HTMLButtonElement, Props>(
  (
    { name, label, disabled = false, className, variant = 'default', size = 'md', onValueChange },
    ref,
  ) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-start space-x-3">
          <Controller
            name={name}
            control={control}
            render={({ field }) => {
              return (
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={checked => {
                    field.onChange(checked);

                    onValueChange?.(checked as boolean);
                  }}
                  onBlur={field.onBlur}
                  disabled={disabled}
                  size={size}
                  variant={variant}
                  label={label}
                  ref={ref}
                  aria-invalid={!!errorMessage}
                  aria-describedby={errorMessage ? `${name}-error` : undefined}
                />
              );
            }}
          />
        </div>

        {errorMessage && (
          <div id={`${name}-error`} role="alert">
            <span className="mt-1 text-red">{errorMessage}</span>
          </div>
        )}
      </div>
    );
  },
);

RHFCheckbox.displayName = 'RHFCheckbox';
export { RHFCheckbox };
