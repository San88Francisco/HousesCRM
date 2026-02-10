import { cn } from '@/shared/utils/cn';
import React from 'react';

type ScrollContainerProps = {
  scrollRef: React.RefObject<HTMLDivElement>;
  isScrollNeeded: boolean;
  isDragging: boolean;
  handlePointerDown?: (e: React.PointerEvent) => void;
  handlePointerMove?: (e: React.PointerEvent) => void;
  minChartWidth: number;
  children: React.ReactNode;
};

export const ScrollContainer = ({
  scrollRef,
  isScrollNeeded,
  isDragging,
  handlePointerDown,
  handlePointerMove,
  minChartWidth,
  children,
}: ScrollContainerProps) => (
  <div
    ref={scrollRef}
    className={cn(
      isScrollNeeded ? 'overflow-x-auto' : 'overflow-x-hidden',
      'overflow-y-hidden',
      isScrollNeeded && (isDragging ? 'cursor-grabbing' : 'cursor-grab'),
      'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200',
    )}
    onPointerDown={isScrollNeeded ? handlePointerDown : undefined}
    onPointerMove={isScrollNeeded ? handlePointerMove : undefined}
  >
    <div style={{ minWidth: isScrollNeeded ? `${minChartWidth}px` : '100%' }}>{children}</div>
  </div>
);
