'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RHFInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
}

const RHFInput = forwardRef<HTMLInputElement, RHFInputProps>(
  ({ name, label, required = false, className, ...props }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={name} className="flex items-center gap-1 ">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              id={name}
              {...field}
              value={field.value || ''}
              onChange={e => {
                field.onChange(e.target.value);
              }}
              error={errorMessage}
              aria-invalid={!!errorMessage}
              {...props}
              ref={ref}
            />
          )}
        />
      </div>
    );
  },
);

RHFInput.displayName = 'RHFInput';

export { RHFInput };
