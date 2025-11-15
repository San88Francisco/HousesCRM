import { cn } from '@/shared/utils/cn';
import { FC, ReactNode } from 'react';
/* eslint-disable */

type CellSize = 'small' | 'big';

interface ICalendarCellProps {
  size?: CellSize;
  isCurrentDate?: boolean;
  isOutOfPeriod?: boolean;
  inRange?: boolean;
  isSelected?: boolean;
  isLeftSide?: boolean;
  isRightSide?: boolean;
  isDisabled?: boolean;
  children: ReactNode;
  dateTime: string;
  onClick: () => void;
  onMouseEnter?: () => void;
}

const baseStyles =
  'w-full rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest dark:hover:bg-dark';

const currentDateStyle =
  'text-gray rounded-[0.75rem] border border-solid border-gray hover:border-gray-medium hover:text-gray hover:bg-foreground dark:text-dark-medium dark:border-dark-medium';

const CalendarCell: FC<ICalendarCellProps> = ({
  size = 'small',
  isCurrentDate = false,
  isOutOfPeriod = false,
  inRange = false,
  isSelected = false,
  isLeftSide = false,
  isRightSide = false,
  isDisabled = false,
  children,
  dateTime,
  onClick,
  onMouseEnter,
  ...props
}) => {
  const cellSize = size === 'small' ? 'h-[2.125rem]' : 'h-[2.5rem]';
  return (
    <div
      className={cn(
        `${cellSize} ${baseStyles}`,
        inRange && 'bg-dark-lightest rounded-[0] dark:bg-dark',
        isLeftSide && 'rounded-l-[0.75rem]',
        isRightSide && 'rounded-r-[0.75rem]',
      )}
    >
      <time
        dateTime={dateTime}
        onClick={() => {
          if (isDisabled) {
            return;
          }
          onClick();
        }}
        onMouseEnter={onMouseEnter}
        {...props}
        className={cn(
          `${cellSize} ${baseStyles}`,
          isOutOfPeriod && 'text-dark-medium',
          isDisabled &&
            'opacity-50 text-dark-medium cursor-not-allowed pointer-events-none bg-transparent hover:bg-transparent',
          inRange && 'rounded-[0]',
          isCurrentDate && currentDateStyle,
          isSelected &&
            'bg-gray border-none dark:bg-gray text-white hover:text-white hover:bg-gray-medium active:bg-gray active:border-dark-light dark:hover:text-white dark:hover:bg-gray dark:text-white',
          isLeftSide && 'rounded-l-[0.75rem]',
          isRightSide && 'rounded-r-[0.75rem]',
        )}
      >
        {children}
      </time>
    </div>
  );
};

export default CalendarCell;
