'use client';

import { getLevelByPath } from '@/shared/utils/header/header-breadcrumb';
import { resolveBreadcrumbLabel } from '@/shared/utils/header/header-resolve-breadcrumb-label';
import { localStorageService } from '@/shared/utils/header/header-storage-service';
import { useLazyGetHouseByIdQuery } from '@/store/api/houses-api';
import { useLazyGetRenterByIdQuery } from '@/store/api/renters-api';
import { Crumb } from '@/types/core/header/header-breadcrumb';
import { useEffect, useState } from 'react';

export const useBreadcrumbTrail = (pathname: string) => {
  const [crumbs, setCrumbs] = useState<Crumb[]>(() => localStorageService.load());

  const [triggerHouse] = useLazyGetHouseByIdQuery();
  const [triggerRenter] = useLazyGetRenterByIdQuery();

  useEffect(() => {
    localStorageService.save(crumbs);
  }, [crumbs]);

  useEffect(() => {
    if (!pathname) return;
    let isCurrent = true;

    const segments = pathname.split('/').filter(Boolean);
    const level = getLevelByPath(pathname);

    resolveBreadcrumbLabel(segments, triggerHouse, triggerRenter).then(label => {
      if (!isCurrent) return;
      setCrumbs(prev => {
        const newCrumbs = prev.filter(c => c.level < level);
        newCrumbs.push({ label, href: pathname, level });
        return newCrumbs;
      });
    });

    return () => {
      isCurrent = false;
    };
  }, [pathname, triggerHouse, triggerRenter]);

  return crumbs;
};
