import { ChangeEventHandler, useEffect, useMemo, useState } from 'react';
/* eslint-disable */

type ChangeHandler = ChangeEventHandler<HTMLTextAreaElement> | undefined;

export function useTextareaCounter(
  maxLengthProp: number | string | undefined,
  value: unknown,
  defaultValue: unknown,
  onChange: ChangeHandler,
) {
  const initialLength = useMemo(() => {
    if (typeof value === 'string') return value.length;
    if (typeof defaultValue === 'string') return defaultValue.length;
    return 0;
  }, [value, defaultValue]);

  const [currentLength, setCurrentLength] = useState<number>(initialLength);

  useEffect(() => {
    if (typeof value === 'string') {
      setCurrentLength(value.length);
    }
  }, [value]);

  const normalizedMax = useMemo(() => {
    if (maxLengthProp == null) return undefined;
    const n = Number(maxLengthProp);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }, [maxLengthProp]);

  const showCounter = typeof normalizedMax === 'number';
  const remaining = showCounter ? Math.max(0, (normalizedMax as number) - currentLength) : 0;

  const composedOnChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    setCurrentLength(e.target.value.length);
    onChange?.(e);
  };

  return {
    normalizedMax,
    remaining,
    showCounter,
    composedOnChange,
  } as const;
}
