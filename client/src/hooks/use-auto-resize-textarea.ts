import {
  ChangeEventHandler,
  FormEventHandler,
  Ref,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

type ChangeHandler = ChangeEventHandler<HTMLTextAreaElement> | undefined;

type Props = {
  setRef: (node: HTMLTextAreaElement | null) => void;
  handleChange: ChangeEventHandler<HTMLTextAreaElement>;
  handleInput: FormEventHandler<HTMLTextAreaElement>;
};

export function useAutoResizeTextarea(
  forwardedRef: Ref<HTMLTextAreaElement> | undefined,
  onChange: ChangeHandler,
  value: string | number | readonly string[] | undefined,
): Props {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const manualResizingRef = useRef<boolean>(false);

  const assignRef = <T>(targetRef: Ref<T> | undefined, val: T | null) => {
    if (typeof targetRef === 'function') {
      targetRef(val);
    } else if (targetRef && typeof targetRef === 'object') {
      (targetRef as unknown as { current: T | null }).current = val;
    }
  };

  const setRef = (node: HTMLTextAreaElement | null) => {
    innerRef.current = node;
    assignRef(forwardedRef, node);
  };

  const resize = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    const currentHeight = el.offsetHeight;
    const neededHeight = el.scrollHeight;
    if (neededHeight > currentHeight) {
      el.style.height = '0px';
      el.style.height = `${neededHeight}px`;
    }
  }, []);

  useLayoutEffect(() => {
    resize();
  }, [value, resize]);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    el.style.overflowY = 'hidden';

    const tick = () => {
      const node = innerRef.current;
      if (!node) return;
      if (!manualResizingRef.current) return;
      const contentExceeds = node.scrollHeight > node.clientHeight;
      node.style.overflowY = contentExceeds ? 'auto' : 'hidden';
      rafIdRef.current = requestAnimationFrame(tick);
    };

    const onPointerDown = () => {
      manualResizingRef.current = true;
      if (rafIdRef.current == null) {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    const onPointerUp = () => {
      manualResizingRef.current = false;
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (innerRef.current) {
        const contentExceeds = innerRef.current.scrollHeight > innerRef.current.clientHeight;
        innerRef.current.style.overflowY = contentExceeds ? 'auto' : 'hidden';
      }
    };

    el.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    el.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    return () => {
      el.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      el.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchend', onPointerUp);
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
    onChange?.(e);
    resize();
  };

  const handleInput: React.FormEventHandler<HTMLTextAreaElement> = () => {
    resize();
  };

  return { setRef, handleChange, handleInput };
}
