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

const HeaderNavigation = () => {
  const pathname = usePathname();
  const breadcrumbItems = useBreadcrumbTrail(pathname);

  return (
    <div className="flex ml-2 items-end gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="contents">
              <BreadcrumbItem>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default HeaderNavigation;
