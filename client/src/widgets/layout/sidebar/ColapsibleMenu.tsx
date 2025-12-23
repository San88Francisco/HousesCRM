'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SubNavItem } from '@/types/navigation';
import {
  getChevronClasses,
  SIDEBAR_STYLES,
  getCollapsibleHeaderClasses,
} from '@/shared/constants/styles';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

type Props = {
  title: string;
  items?: SubNavItem[];
};

export const CollapsibleMenu = ({ title, items }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleOpen = () => setIsOpen(prev => !prev);

  return (
    <div className={SIDEBAR_STYLES.collapsible.container}>
      <div className={getCollapsibleHeaderClasses()} onClick={toggleOpen}>
        <Button variant="icon" size="xs" className={SIDEBAR_STYLES.collapsible.button}>
          <ChevronRight className={getChevronClasses(isOpen)} />
        </Button>

        <div className={SIDEBAR_STYLES.collapsible.iconContainer}>
          <span>{title}</span>
        </div>
      </div>

      <motion.div
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={SIDEBAR_STYLES.animations.collapsible}
        className={SIDEBAR_STYLES.collapsible.contentWrapper}
      >
        <div className={SIDEBAR_STYLES.collapsible.content}>
          {items?.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={`${item.title}-${index}`}
                href={item.url}
                className={cn(SIDEBAR_STYLES.collapsible.link, 'flex items-center gap-2')}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
