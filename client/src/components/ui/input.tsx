'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';

interface InputProps extends React.ComponentProps<'input'> {
  helperText?: string;
  error?: boolean;
  icon?: React.ReactNode;
  iconWithError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, helperText, error, icon, iconWithError = false, disabled, ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState<boolean>(false);

    return (
      <div>
        <div
          className={cn(
            'flex items-center h-10 px-2 w-full text-black text-sm transition-all duration-200 ease-in-out bg-gray-50 rounded-lg border border-solid border-border [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4  ',
            disabled && 'cursor-not-allowed opacity-50',
            isFocused && 'border-sky-600',
            error && 'border-destructive text-destructive',
            className,
          )}
        >
          {icon && (
            <span
              className={cn(
                'transition-all duration-200 ease-in-out',
                isFocused && 'text-sky-600',
                error && 'text-destructive',
              )}
            >
              {icon}
            </span>
          )}
          <input
            className={cn(
              'flex w-full px-2 bg-inherit text-black text-sm ring-offset-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:none disabled:cursor-not-allowed disabled:opacity-50',
              error && 'text-destructive',
            )}
            type={type}
            ref={ref}
            disabled={disabled}
            {...props}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {error && iconWithError && <CircleAlert className="text-destructive" />}
        </div>
        {helperText && (
          <p className={`mt-1 text-sm ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
