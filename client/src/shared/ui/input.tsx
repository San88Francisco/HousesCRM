'use client';

import { CircleAlert } from 'lucide-react';
import { ComponentProps, forwardRef, ReactNode, useState } from 'react';
import { cn } from '../utils/cn';
/* eslint-disable */

interface InputProps extends ComponentProps<'input'> {
  error?: boolean;
  icon?: ReactNode;
  iconWithError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, iconWithError = false, disabled, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    return (
      <div>
        <div
          className={cn(
            'flex items-center h-10 px-2 w-full text-sm transition-all duration-200 ease-in-out bg-bg-input rounded-lg border border-solid border-border [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4',
            disabled && 'cursor-not-allowed opacity-50',
            isFocused && 'border-active-border',
            error && 'border-red text-red',
            className,
          )}
        >
          {icon && (
            <span
              className={cn(
                'transition-all duration-200 ease-in-out text-muted',
                isFocused && 'text-active-border',
                error && 'text-red',
              )}
            >
              {icon}
            </span>
          )}
          <input
            className={cn(
              'flex w-full px-2 bg-inherit text-text text-sm ring-offset-none placeholder:text-muted focus-visible:outline-none focus-visible:none disabled:cursor-not-allowed disabled:opacity-50',
              error && 'text-red',
            )}
            type={type}
            ref={ref}
            disabled={disabled}
            {...props}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {error && iconWithError && <CircleAlert className="text-red" />}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
