'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { ROUTES } from '@/shared/routes';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/shared/ui/breadcrumb';

import FavoriteStar from './FavoriteStar';

const HeaderNavigation = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const breadcrumbItems = (() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const items = [{ label: 'Home', href: ROUTES.HOME }];

    pathSegments.forEach((segment, index) => {
      const href = ROUTES.HOME + pathSegments.slice(0, index + 1).join('/');
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      items.push({ label, href });
    });

    const params = Array.from(searchParams.entries());
    if (params.length > 0) {
      params.forEach(([key, value]) => {
        items.push({
          label: `${key}: ${value}`,
          href: `${pathname}?${searchParams.toString()}`,
        });
      });
    }

    return items;
  })();

  return (
    <div className="flex items-center gap-3">
      <FavoriteStar />

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <div key={item.href} className="contents">
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
