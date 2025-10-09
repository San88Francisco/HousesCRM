'use client';

import { cn } from '@/lib/utils';
import { ComponentProps, forwardRef } from 'react';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { useTextareaCounter } from '@/hooks/use-textarea-counter';
import { CircleAlert } from 'lucide-react';

interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'maxLength'> {
  maxLength?: number | string;
  error?: boolean;
  helperText?: string | boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, maxLength, error, helperText, ...props }, ref) => {
    const { normalizedMax, remaining, showCounter, composedOnChange } = useTextareaCounter(
      maxLength,
      props.value,
      props.defaultValue,
      onChange,
    );

    const { setRef, handleChange, handleInput } = useAutoResizeTextarea(
      ref,
      composedOnChange,
      props.value,
    );

    return (
      <div className={cn('relative', className)}>
        <textarea
          className={cn(
            'custom-scrollbar flex min-h-[80px] w-full resize-y overflow-hidden rounded-lg border border-solid border-border bg-bg-input px-2 py-2 text-sm text-text placeholder:text-muted outline-none focus:border-active-border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out',
            error && 'border-red text-red focus:border-red',
          )}
          ref={setRef}
          onChange={handleChange}
          onInput={handleInput}
          maxLength={normalizedMax}
          {...props}
        />
        {error && <CircleAlert className="text-red h-4 w-4 absolute right-2 top-2" />}
        {showCounter && (
          <p
            className={cn(
              'text-sm text-muted mt-1  select-none pointer-events-none',
              error && 'text-red',
            )}
          >
            {!error ? `remained ${remaining} symbols` : helperText}
          </p>
        )}
        {helperText && !showCounter && (
          <p className={cn('mt-1 text-sm', error ? 'text-red' : 'text-muted')}>{helperText}</p>
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
