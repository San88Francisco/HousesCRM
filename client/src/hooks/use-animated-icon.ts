import { useRef, ReactElement, isValidElement, cloneElement, ReactNode, Ref } from 'react';
import { AnimatedIconHandle } from '@/types/navigation';

export const useAnimatedIcon = (icon: ReactNode) => {
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
