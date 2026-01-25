'use client';

import { cn } from '@/shared/utils/cn';
import { motion, Transition, useAnimation, Variants } from 'framer-motion';
import type { HTMLAttributes, MouseEvent } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

export interface LogoutIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface LogoutIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const defaultTransition: Transition = {
  duration: 0.6,
  opacity: { duration: 0.2 },
};

const arrowVariants: Variants = {
  normal: {
    x: 0,
    opacity: 1,
  },
  animate: {
    x: [0, 3, 0],
    opacity: [1, 1, 1],
  },
};

export const LogoutIcon = forwardRef<LogoutIconHandle, LogoutIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    }, [controls]);

    const handleMouseEnter = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('animate');
        }
        onMouseEnter?.(e);
      },
      [controls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('normal');
        }
        onMouseLeave?.(e);
      },
      [controls, onMouseLeave],
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label="Logout"
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
          aria-hidden="true"
        >
          <title>Logout</title>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <motion.g variants={arrowVariants} transition={defaultTransition} animate={controls}>
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </motion.g>
        </svg>
      </div>
    );
  },
);

LogoutIcon.displayName = 'LogoutIcon';
