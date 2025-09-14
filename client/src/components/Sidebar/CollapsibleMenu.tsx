'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CollapsibleMenuProps } from '@/types/navigation';
import {
  SIDEBAR_STYLES,
  getCollapsibleHeaderClasses,
  getChevronClasses,
} from '@/constants/styles/sidebar';

export const CollapsibleMenu = ({ title, icon, items }: CollapsibleMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(prev => !prev);

  return (
    <div className={SIDEBAR_STYLES.collapsible.container}>
      <div className={getCollapsibleHeaderClasses()}>
        <Button
          variant="icon"
          size="xs"
          className={SIDEBAR_STYLES.collapsible.button}
          onClick={toggleOpen}
        >
          <ChevronRight className={getChevronClasses(isOpen)} />
        </Button>

        <div className={SIDEBAR_STYLES.collapsible.iconContainer}>
          {icon}
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
          {items?.map((item, index) => (
            <Link
              key={`${item.title}-${index}`}
              href={item.url}
              className={SIDEBAR_STYLES.collapsible.link}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
