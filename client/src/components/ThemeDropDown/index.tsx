import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/use-theme';
import { themeOptions } from '@/constants/themeOptions/themeOptions';
import { FC } from 'react';

type Props = {
  className?: string;
};

export const ThemeDropDown: FC<Props> = ({ className }) => {
  const { theme, changeTheme } = useTheme();

  const current = themeOptions.find(opt => opt.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={` dark:bg-[#0e1217] text-[#6b7280] px-16 ${className}`}
        >
          {current?.icon}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {themeOptions.map(opt => (
          <DropdownMenuItem key={opt.value} onClick={() => changeTheme(opt.value)}>
            <div className="flex items-center gap-2 w-full text-[#6b7280]">
              {opt.icon}
              {opt.label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
