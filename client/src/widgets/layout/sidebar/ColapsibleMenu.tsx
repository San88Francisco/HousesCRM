'use client';

import { MouseEvent, ReactNode, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavItem } from '@/types/navigation';
import {
  getChevronClasses,
  SIDEBAR_STYLES,
  getCollapsibleHeaderClasses,
} from '@/shared/constants/styles';
import { Button } from '@/shared/ui/button';
import { SidebarMenu, useSidebar } from '@/shared/ui/sidebar';
import { SidebarMenuItem } from './SidebarMenuItem';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

type Props = {
  title: string;
  icon: ReactNode;
  items?: NavItem[];
};

export const CollapsibleMenu = ({ title, icon, items }: Props) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const [isOpen, setIsOpen] = useState(false);

  if (!items?.length) return null;

  const toggleOpen = () => setIsOpen(prev => !prev);

  const handleClickChevron = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleOpen();
  };

  const header = (
    <div className={getCollapsibleHeaderClasses()} onClick={toggleOpen}>
      {!isCollapsed && (
        <Button
          variant="icon"
          className={SIDEBAR_STYLES.collapsible.button}
          onClick={handleClickChevron}
        >
          <ChevronRight className={getChevronClasses(isOpen)} />
        </Button>
      )}

      <div className={SIDEBAR_STYLES.collapsible.iconContainer}>
        {icon}
        {!isCollapsed && <span>{title}</span>}
      </div>
    </div>
  );

  return (
    <div className={SIDEBAR_STYLES.collapsible.container}>
      {isCollapsed ? (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>{header}</TooltipTrigger>
            <TooltipContent side="right" className="bg-background border shadow-md">
              {title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        header
      )}

      <motion.div
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={SIDEBAR_STYLES.animations.collapsible}
        className={SIDEBAR_STYLES.collapsible.contentWrapper}
      >
        <SidebarMenu className={SIDEBAR_STYLES.collapsible.content}>
          {items.map(item => (
            <SidebarMenuItem key={item.url ?? item.title} item={item} hideTitle={isCollapsed} />
          ))}
        </SidebarMenu>
      </motion.div>
    </div>
  );
};
