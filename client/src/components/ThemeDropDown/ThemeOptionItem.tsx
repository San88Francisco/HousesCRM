'use client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useAnimatedIcon } from '@/hooks';
import { ElementType } from 'react';

interface Props {
  icon: ElementType;
  onClick: () => void;
}

export const ThemeOptionItem = ({ icon: Icon, onClick }: Props) => {
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(<Icon />);

  return (
    <DropdownMenuItem
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex items-center justify-center p-3"
    >
      <Button size="lg" variant="icon" className="p-0 m-0">
        {animatedIcon}
      </Button>
    </DropdownMenuItem>
  );
};
