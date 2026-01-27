'use client';

import { cn } from '@/shared/utils/cn';
import { motion, useAnimation } from 'framer-motion';
import type { HTMLAttributes } from 'react';
import { forwardRef, useCallback } from 'react';

interface LogoutIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const TRANSITION = { duration: 0.6, opacity: { duration: 0.2 } };
const VARIANTS = {
  normal: { x: 0, opacity: 1 },
  animate: { x: [0, 3, 0], opacity: [1, 1, 1] },
};

export const LogoutIcon = forwardRef<HTMLDivElement, LogoutIconProps>(
  ({ className, size = 16, ...props }, ref) => {
    const controls = useAnimation();

    const handleMouseEnter = useCallback(() => {
      controls.start('animate');
    }, [controls]);

    const handleMouseLeave = useCallback(() => {
      controls.start('normal');
    }, [controls]);

    return (
      <div
        ref={ref}
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <motion.g variants={VARIANTS} transition={TRANSITION} animate={controls}>
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </motion.g>
        </svg>
      </div>
    );
  },
);

LogoutIcon.displayName = 'LogoutIcon';
