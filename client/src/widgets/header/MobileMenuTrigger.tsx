'use client';

import { Button } from '@/shared/ui/button';
import { useSidebar } from '@/shared/ui/sidebar';
import { Menu } from 'lucide-react';

export const MobileMenuTrigger = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      type="button"
      variant="icon"
      size="lg"
      className="h-10 w-10 shrink-0"
      aria-label="Відкрити меню навігації"
      onClick={() => toggleSidebar()}
    >
      <Menu className="h-6 w-6 text-text" strokeWidth={2} aria-hidden />
    </Button>
  );
};
