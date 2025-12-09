'use client';

import {
  forwardRef,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  useRef,
  ReactNode,
  useState,
} from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { cn } from '@/shared/utils/cn';
import { useHotkeyForRef } from '@/hooks/use-hotkey-for-ref';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  icon?: ReactNode;
  iconWithError?: boolean;
  type?: HTMLInputTypeAttribute;
  hotkey?: string;
  hotkeyCtrl?: boolean;
  hotkeyShift?: boolean;
  hotkeyAlt?: boolean;
  hotkeyMeta?: boolean;
  hotkeyAction?: 'focus' | 'click';
  className?: string;
}

const RHFInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      name,
      label,
      required = false,
      icon,
      iconWithError = true,
      type = 'text',
      className,
      hotkey,
      hotkeyCtrl,
      hotkeyShift,
      hotkeyAlt,
      hotkeyMeta,
      hotkeyAction = 'focus',
      disabled = false,
      ...props
    },
    forwardedRef,
  ) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();
    const [isFocused, setIsFocused] = useState(false);

    const error = errors[name];
    const errorMessage = error?.message as string | undefined;

    const internalRef = useRef<HTMLInputElement | null>(null);

    useHotkeyForRef(hotkey, internalRef, hotkeyAction, {
      ctrl: !!hotkeyCtrl,
      shift: !!hotkeyShift,
      alt: !!hotkeyAlt,
      meta: !!hotkeyMeta,
    });

    const hotkeyHint =
      hotkey &&
      [
        hotkeyCtrl && 'Ctrl',
        hotkeyShift && 'Shift',
        hotkeyAlt && 'Alt',
        hotkeyMeta && '⌘',
        hotkey.toUpperCase(),
      ]
        .filter(Boolean)
        .join(' + ');

    return (
      <div className={cn('space-y-2', className)}>
        {label && !error && (
          <Label htmlFor={name} className="flex items-center gap-1">
            {label}
          </Label>
        )}

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <div
              className="relative"
              onFocusCapture={() => setIsFocused(true)}
              onBlurCapture={() => setIsFocused(false)}
            >
              <Input
                id={name}
                {...field}
                value={field.value || ''}
                type={type}
                onChange={e => field.onChange(e.target.value)}
                error={errorMessage}
                aria-invalid={!!errorMessage}
                aria-describedby={errorMessage ? `${name}-error` : undefined}
                icon={icon}
                iconWithError={iconWithError}
                {...props}
                ref={el => {
                  internalRef.current = el;
                  if (typeof forwardedRef === 'function') forwardedRef(el);
                  else if (forwardedRef) {
                    (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
                  }
                }}
              />

              {hotkeyHint && !isFocused && (
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-text">
                  {hotkeyHint}
                </span>
              )}
            </div>
          )}
        />

        {error && <p className="text-sm text-red !mt-0">{errorMessage}</p>}
      </div>
    );
  },
);

RHFInput.displayName = 'RHFInput';
export { RHFInput };
