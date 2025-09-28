import { useRef, ReactElement, isValidElement, cloneElement } from 'react';
import { AnimatedIconHandle } from '@/types/navigation';
/* eslint-disable */

export const useAnimatedIcon = (icon: React.ReactNode) => {
  const iconRef = useRef<AnimatedIconHandle | null>(null);

  const handleMouseEnter = () => {
    if (iconRef.current) {
      iconRef.current.startAnimation();
    }
  };

  const handleMouseLeave = () => {
    if (iconRef.current) {
      iconRef.current.stopAnimation();
    }
  };

  const animatedIcon = isValidElement(icon)
    ? cloneElement(icon as ReactElement<{ ref?: React.Ref<AnimatedIconHandle> }>, {
        ref: iconRef,
      })
    : icon;

  return {
    animatedIcon,
    handleMouseEnter,
    handleMouseLeave,
  };
};
