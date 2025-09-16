'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Item = { title: string; url: string };

type Props = {
  title: string;
  icon: ReactElement;
  items?: Item[];
};

export const CollapsibleComponent = ({ title, icon, items }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const hoverStyles = 'hover:bg-bg-input';
  const collapsibleIconStyles =
    'group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:hover:bg-transparent';
  const linkStyles = 'text-text rounded-[12px]';

  return (
    <div className="flex flex-col w-full">
      <div
        className={cn(
          'flex items-center text-text gap-2 pl-[13px] py-2',
          hoverStyles,
          'rounded-[12px]',
          collapsibleIconStyles,
        )}
      >
        <Button variant="icon" size="xs" className="p-0" onClick={() => setIsOpen(prev => !prev)}>
          <ChevronRight
            className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          />
        </Button>

        <div className="flex items-center gap-2">
          {icon && icon}
          <span>{title}</span>
        </div>
      </div>

      <motion.div
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
          opacity: { duration: 0.2, ease: 'easeOut' },
        }}
        className="overflow-hidden "
      >
        <div className="flex flex-col gap-2   mt-2 w-full">
          {items?.map((item, i) => (
            <Link key={i} href={item.url} className={cn(hoverStyles, 'pl-[60px] py-2', linkStyles)}>
              {item.title}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
