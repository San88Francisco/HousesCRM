import { AnimatedIconHandle } from '@/types/navigation';
import {
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useRef,
} from 'react';

export const useAnimatedIcon = (icon: ReactNode) => {
  const iconRef = useRef<AnimatedIconHandle | null>(null);

  const handleMouseEnter = useCallback(() => {
    const current = iconRef.current as unknown as {
      startAnimation?: () => void;
    } | null;

    if (current && typeof current.startAnimation === 'function') {
      current.startAnimation();
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const current = iconRef.current as unknown as {
      stopAnimation?: () => void;
    } | null;

    if (current && typeof current.stopAnimation === 'function') {
      current.stopAnimation();
    }
  }, []);

  const animatedIcon = isValidElement(icon)
    ? cloneElement(icon as ReactElement<{ ref?: Ref<AnimatedIconHandle> }>, {
        ref: iconRef,
      })
    : icon;

  return {
    animatedIcon,
    handleMouseEnter,
    handleMouseLeave,
  };
};
