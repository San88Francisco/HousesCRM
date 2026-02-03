'use client';

import { getLevelByPath } from '@/shared/utils/header/header-breadcrumb';
import { resolveBreadcrumbLabel } from '@/shared/utils/header/header-resolve-breadcrumb-label';
import { localStorageService } from '@/shared/utils/header/header-storage-service';
import { useLazyGetHouseByIdQuery, useLazyGetRenterByIdQuery } from '@/store/api/houses-api';
import { Crumb } from '@/types/core/header/header-breadcrumb';
import { useEffect, useState } from 'react';

export const useBreadcrumbTrail = (pathname: string) => {
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  const [triggerHouse] = useLazyGetHouseByIdQuery();
  const [triggerRenter] = useLazyGetRenterByIdQuery();

  useEffect(() => {
    const stored = localStorageService.load();
    setCrumbs(stored);
  }, []);

  useEffect(() => {
    if (!pathname) return;

    const segments = pathname.split('/').filter(Boolean);
    const level = getLevelByPath(pathname);

    resolveBreadcrumbLabel(segments, triggerHouse, triggerRenter).then(label => {
      setCrumbs(prev => {
        const newCrumbs = prev.filter(c => c.level < level);
        newCrumbs.push({ label, href: pathname, level });
        localStorageService.save(newCrumbs);
        return newCrumbs;
      });
    });
  }, [pathname, triggerHouse, triggerRenter]);

  return crumbs;
};
