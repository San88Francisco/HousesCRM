'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { ROUTES } from '@/shared/routes';
import { useSidebar } from '@/shared/ui/sidebar';

export const MapSidebarButton = () => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const isActive = pathname.startsWith(ROUTES.MAP);

  if (isCollapsed) {
    return (
      <Link
        href={ROUTES.MAP}
        className={`
          flex items-center justify-center
          w-8 h-8 mx-auto rounded-md
          transition-colors duration-150
          ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-accent-foreground'}
        `}
        title="Карта квартир"
      >
        <MapPin size={16} />
      </Link>
    );
  }

  return (
    <Link
      href={ROUTES.MAP}
      className={`
        group flex items-center gap-2 w-full
        rounded-md px-2 py-1.5 text-sm font-medium
        transition-colors duration-150
        ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-accent-foreground'}
      `}
    >
      <div
        className={`
          relative flex-shrink-0 w-[52px] h-[36px]
          rounded overflow-hidden border
          ${isActive ? 'border-primary-foreground/30' : 'border-border'}
        `}
      >
        <div className="absolute inset-0 bg-[#e8f4e8]" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[40%] left-[10%] right-[10%] h-[1px] bg-[#aac8aa]" />
          <div className="absolute top-[55%] left-[20%] right-[20%] h-[1px] bg-[#aac8aa]" />
          <div className="absolute top-[30%] bottom-[30%] left-[35%] w-[1px] bg-[#aac8aa]" />
          <div className="absolute top-[25%] bottom-[25%] left-[60%] w-[1px] bg-[#aac8aa]" />
        </div>
        <div className="absolute top-[38%] left-[30%] w-[5px] h-[5px] rounded-full bg-primary shadow-sm" />
        <div className="absolute top-[50%] left-[55%] w-[4px] h-[4px] rounded-full bg-primary shadow-sm" />
        <div className="absolute top-[28%] left-[50%] w-[4px] h-[4px] rounded-full bg-primary shadow-sm" />
      </div>
      <span className="truncate">Карта</span>
    </Link>
  );
};
