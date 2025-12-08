import { useRef, ReactElement, isValidElement, cloneElement, ReactNode, Ref } from 'react';
import { AnimatedIconHandle } from '@/types/navigation';

export const useAnimatedIcon = (icon: ReactNode) => {
  const iconRef = useRef<AnimatedIconHandle | null>(null);

  const handleMouseEnter = () => {
    const current = iconRef.current as unknown as {
      startAnimation?: () => void;
    } | null;

    if (current && typeof current.startAnimation === 'function') {
      current.startAnimation();
    }
  };

  const handleMouseLeave = () => {
    const current = iconRef.current as unknown as {
      stopAnimation?: () => void;
    } | null;

    if (current && typeof current.stopAnimation === 'function') {
      current.stopAnimation();
    }
  };

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
