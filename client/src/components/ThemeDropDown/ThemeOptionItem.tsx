'use client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useAnimatedIcon } from '@/hooks';
import { ElementType } from 'react';

interface ThemeOptionItemProps {
  icon: ElementType;
  onClick: () => void;
}

export const ThemeOptionItem = ({ icon: Icon, onClick }: ThemeOptionItemProps) => {
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(
    <Icon className="h-4 w-4" />,
  );

  return (
    <DropdownMenuItem
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center justify-center p-3"
    >
      <Button variant="icon" className="p-0 m-0">
        {animatedIcon}
      </Button>
    </DropdownMenuItem>
  );
};
