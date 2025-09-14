import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/use-theme';
import { useMounted } from '@/hooks/use-mounted';
import { themeOptions } from '@/constants/themeOptions/themeOptions';
import { cn } from '@/lib/utils';
import { ThemeValue } from '@/types/core/theme';

type Props = {
  className?: string;
};

export const ThemeDropDown = ({ className }: Props) => {
  const { theme, changeTheme } = useTheme();
  const mounted = useMounted();

  const currentTheme = useMemo(() => (mounted ? theme : ThemeValue.Auto), [mounted, theme]);

  const currentThemeOption = useMemo(
    () => themeOptions.find(opt => opt.value === currentTheme),
    [currentTheme],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className={cn('px-16', className)}>
          {currentThemeOption?.icon}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {themeOptions.map(opt => (
          <DropdownMenuItem key={opt.value} onClick={() => changeTheme(opt.value)}>
            <div className="flex items-center gap-2 w-full">
              {opt.icon}
              {opt.label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
