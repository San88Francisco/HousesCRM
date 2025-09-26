'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/navigation';

type Props = {
  title: string;
  icon: ReactElement;
  items?: NavItem[];
};

export const CollapsibleComponent = ({ title, icon, items }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center text-text gap-2 pl-[13px] py-2 hover:bg-bg-input rounded-[12px] group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:hover:bg-transparent">
        <Button variant="icon" size="xs" className="p-0" onClick={() => setIsOpen(prev => !prev)}>
          <ChevronRight
            className={cn('transition-transform duration-300', isOpen && 'rotate-90')}
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
            <Link
              key={i}
              href={item.url as string}
              className="hover:bg-bg-input pl-[60px] py-2 text-text rounded-[12px]"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
