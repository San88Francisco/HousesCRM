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
  children: ReactNode;
  dateTime: string;
  onClick: () => void;
  onMouseEnter?: () => void;
}

const baseStyles =
  'w-full rounded-[0.75rem] text-sm font-semibold transition-all duration-150 ease-in-out flex items-center justify-center cursor-pointer hover:bg-dark-lightest';

const currentDateStyle =
  'border border-solid border-active-border text-active-border hover:border-blue-dark hover:text-blue-dark hover:bg-[#dbeafe]';

const CalendarCell: FC<ICalendarCellProps> = ({
  size = 'small',
  isCurrentDate = false,
  isOutOfPeriod = false,
  inRange = false,
  isSelected = false,
  isLeftSide = false,
  isRightSide = false,
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
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      {...props}
      className={cn(
        `${cellSize} ${baseStyles}`,
        isCurrentDate && currentDateStyle,
        isOutOfPeriod && 'text-dark-medium',
        inRange && 'bg-dark-lightest rounded-[0]',
        isSelected && 'bg-active-border text-white hover:text-white hover:bg-blue-dark',
        isLeftSide && 'rounded-l-[0.75rem]',
        isRightSide && 'rounded-r-[0.75rem]',
      )}
    >
      {children}
    </time>
  );
};

export default CalendarCell;
