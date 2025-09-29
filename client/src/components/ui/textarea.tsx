'use client';

import { cn } from '@/lib/utils';
import { ComponentProps, forwardRef } from 'react';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { useTextareaCounter } from '@/hooks/use-textarea-counter';
import { CircleAlert } from 'lucide-react';

interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'maxLength'> {
  maxLength?: number | string;
  error?: boolean;
  helperText?: string;
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
            'custom-scrollbar flex min-h-[80px] w-full resize-y overflow-hidden rounded-md border border-solid border-border bg-bg-input px-3 py-2 text-base placeholder:text-muted focus-visible:outline-none focus-visible:border-active-border disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            error && 'border-red text-red focus-visible:border-red',
          )}
          ref={setRef}
          onChange={handleChange}
          onInput={handleInput}
          maxLength={normalizedMax}
          {...props}
        />
        {showCounter && (
          <p
            className={cn(
              'absolute right-2 -bottom-5 text-xs text-muted select-none pointer-events-none',
              error && 'text-red',
            )}
          >
            {`залишилось ${remaining} символів`}
          </p>
        )}
        {error && <CircleAlert className="text-red absolute right-2 top-2" />}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
