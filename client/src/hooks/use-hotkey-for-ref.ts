import { useEffect, RefObject } from 'react';

type HotkeyAction = 'focus' | 'click';

type HotkeyOptions = {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
};

const isHotkeyEvent = (event: KeyboardEvent, key: string, options: HotkeyOptions): boolean => {
  const { ctrl = false, shift = false, alt = false, meta = false } = options;

  return [
    event.key.toLowerCase() === key.toLowerCase(),
    event.ctrlKey === ctrl,
    event.shiftKey === shift,
    event.altKey === alt,
    event.metaKey === meta,
  ].every(Boolean);
};

export const useHotkeyForRef = (
  key: string | undefined,
  ref: RefObject<HTMLElement | null>,
  action: HotkeyAction = 'focus',
  options: HotkeyOptions = {},
) => {
  const { ctrl = false, shift = false, alt = false, meta = false, preventDefault = true } = options;

  useEffect(() => {
    if (!key) return;

    const handler = (event: KeyboardEvent) => {
      if (!isHotkeyEvent(event, key, { ctrl, shift, alt, meta })) return;

      if (preventDefault) event.preventDefault();

      const el = ref.current;
      if (!el) return;

      if (action === 'focus') el.focus();
      else if (action === 'click') el.click();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, ref, action, ctrl, shift, alt, meta, preventDefault]);
};
