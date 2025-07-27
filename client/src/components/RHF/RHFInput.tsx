'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
          <Label htmlFor={name} className="flex items-center gap-1">
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
              className={cn(
                errorMessage && 'border-destructive focus-visible:ring-destructive',
                className,
              )}
              aria-invalid={!!errorMessage}
              {...props}
              ref={ref}
            />
          )}
        />

        {errorMessage && (
          <div className="flex justify-center items-center mt-1.5 text-sm text-destructive bg-destructive/10 py-1.5 px-3 rounded-md animate-in fade-in-50 duration-300">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  },
);

RHFInput.displayName = 'RHFInput';

export { RHFInput };
