import { cn } from '@/lib/utils';
import { FC, ReactNode } from 'react';

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
  'w-full rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest dark:hover:text-dark-medium';

const currentDateStyle =
  'text-gray border border-solid border-gray hover:border-gray-medium hover:text-gray hover:bg-foreground dark:hover:text-gray';

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
    <time
      dateTime={dateTime}
      onClick={() => {
        if (isDisabled) return;
        onClick();
      }}
      onMouseEnter={onMouseEnter}
      {...props}
      className={cn(
        `${cellSize} ${baseStyles}`,
        isOutOfPeriod && 'text-dark-medium',
        isDisabled &&
          'opacity-50 text-dark-medium cursor-not-allowed pointer-events-none bg-transparent hover:bg-transparent', // todo dark mode
        isCurrentDate && currentDateStyle,
        inRange && 'bg-dark-lightest rounded-[0]',
        isSelected &&
          'bg-gray text-white hover:text-white hover:bg-gray-medium active:bg-gray active:border-dark-light dark:hover:text-white',
        isLeftSide && 'rounded-l-[0.75rem]',
        isRightSide && 'rounded-r-[0.75rem]',
      )}
    >
      {children}
    </time>
  );
};

export default CalendarCell;
