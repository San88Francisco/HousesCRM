'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Star } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LIKED_ROUTES_KEY } from '@/constants/breadcrumbs/breadcrumbs';
import { ROUTES } from '@/shared/routes';
import { Button } from '@/shared/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/shared/ui/breadcrumb';

const HeaderNavigation = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [likedRoutes, setLikedRoutes] = useState<string[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LIKED_ROUTES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLikedRoutes(parsed);
        setIsLiked(parsed.includes(pathname));
      } catch (error) {
        console.error('Failed to parse liked routes:', error);
      }
    }
  }, [pathname]);

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

  const toggleLike = () => {
    const newLikedRoutes = isLiked
      ? likedRoutes.filter(route => route !== pathname)
      : [...likedRoutes, pathname];

    setLikedRoutes(newLikedRoutes);
    setIsLiked(!isLiked);
    localStorage.setItem(LIKED_ROUTES_KEY, JSON.stringify(newLikedRoutes));
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="icon"
        className="w-10 h-10 bg-transparent transition-all"
        onClick={toggleLike}
      >
        <Star
          className={
            isLiked
              ? 'text-[color:gold] fill-[color:gold] drop-shadow-[0_0_6px_rgba(245,197,66,0.55)]'
              : 'text-text'
          }
          fill={isLiked ? 'currentColor' : 'none'}
        />
      </Button>

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
