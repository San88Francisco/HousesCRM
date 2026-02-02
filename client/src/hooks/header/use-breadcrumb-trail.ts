'use client';

import { STATIC_LABELS } from '@/shared/constants/header/header-breadcrumb';
import { getLevelByPath } from '@/shared/utils/header/header-breadcrumb';
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

    const resolveLabel = async () => {
      let label = STATIC_LABELS[`/${segments[0]}`] || segments[segments.length - 1];

      if (segments[0] === 'house' && segments[1]) {
        const result = await triggerHouse(segments[1]).unwrap();
        if (result?.houseDetail?.apartmentName) {
          label = result.houseDetail.apartmentName;
        }
      }

      if (segments[0] === 'renter' && segments[1]) {
        const result = await triggerRenter(segments[1]).unwrap();
        if (result?.oneRenterReport?.firstName) {
          label = `${result.oneRenterReport.firstName} ${result.oneRenterReport.lastName}`;
        }
      }

      return label;
    };

    resolveLabel().then(label => {
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
