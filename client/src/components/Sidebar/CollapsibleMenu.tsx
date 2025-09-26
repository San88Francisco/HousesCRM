'use client';

import { ReactNode, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import {
  SIDEBAR_STYLES,
  getCollapsibleHeaderClasses,
  getChevronClasses,
} from '@/constants/styles/sidebar';
import { SubNavItem } from '@/types/navigation';

type Props = {
  title: string;
  icon: ReactNode;
  items?: SubNavItem[];
};

export const CollapsibleMenu = ({ title, icon, items }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = () => setIsOpen(prev => !prev);

  return (
    <div className={SIDEBAR_STYLES.collapsible.container}>
      <div className={getCollapsibleHeaderClasses()} onClick={toggleOpen}>
        <Button variant="icon" size="xs" className={SIDEBAR_STYLES.collapsible.button}>
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
