'use client';

import Link from 'next/link';

import { useBreadcrumbTrail } from '@/hooks/header/use-breadcrumb-trail';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const HeaderNavigation = () => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const breadcrumbItems = useBreadcrumbTrail(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return '/';

  return (
    <div className="flex ml-2 items-end gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <span key={index} className="contents">
              <BreadcrumbItem key={index}>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default HeaderNavigation;
