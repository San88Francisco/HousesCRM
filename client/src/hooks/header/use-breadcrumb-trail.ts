// 'use client';

// import { useEffect, useState } from 'react';

// export type Crumb = {
//   label: string;
//   href: string;
//   level: number;
// };

// const STORAGE_KEY = 'breadcrumb-trail';

// // todo with routs
// const LEVELS: Record<string, number> = {
//   'all-houses': 1,
//   'all-renters': 1,
//   uikit: 1,
//   house: 2,
//   renter: 3,
//   contract: 2,
// };

// const getLevelByPath = (pathname: string): number => {
//   if (!pathname) return 1;
//   if (pathname.startsWith('/all-houses')) return LEVELS['all-houses'];
//   if (pathname.startsWith('/all-renters')) return LEVELS['all-renters'];
//   if (pathname.startsWith('/uikit')) return LEVELS['uikit'];
//   if (pathname.startsWith('/house')) return LEVELS['house'];
//   if (pathname.startsWith('/renter')) return LEVELS['renter'];
//   if (pathname.startsWith('/contract')) return LEVELS['contract'];
//   return 1;
// };

// const localStorageService = {
//   load: (): Crumb[] => {
//     if (typeof window === 'undefined') return [];
//     try {
//       const stored = localStorage.getItem(STORAGE_KEY);
//       return stored ? JSON.parse(stored) : [];
//     } catch {
//       return [];
//     }
//   },

//   save: (crumbs: Crumb[]) => {
//     if (typeof window === 'undefined') return;
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(crumbs));
//     } catch (error) {
//       console.error('failed to save crumb', error);
//     }
//   },

//   clear: () => {
//     if (typeof window === 'undefined') return;
//     localStorage.removeItem(STORAGE_KEY);
//   },
// };

// export const useBreadcrumbTrail = (pathname: string) => {
//   const [crumbs, setCrumbs] = useState<Crumb[]>([]);

//   useEffect(() => {
//     const stored = localStorageService.load();
//     setCrumbs(stored);
//   }, []);

//   useEffect(() => {
//     if (!pathname) return;

//     const level = getLevelByPath(pathname);
//     const label = pathname.split('/').filter(Boolean).pop() || 'Home';

//     setCrumbs(prev => {
//       const newCrumbs = prev.filter(c => c.level < level);

//       newCrumbs.push({ label, href: pathname, level });

//       localStorageService.save(newCrumbs);

//       return newCrumbs;
//     });
//   }, [pathname]);

//   return crumbs;
// };

// 'use client';

// import { useLazyGetHouseByIdQuery, useLazyGetRenterByIdQuery } from '@/store/api/houses-api';
// import { useEffect, useState } from 'react';

// export type Crumb = {
//   label: string;
//   href: string;
//   level: number;
// };

// const STATIC_LABELS: Record<string, string> = {
//   '/all-houses': 'All Houses',
//   '/all-renters': 'All Renters',
//   '/uikit': 'UIKit',
// };

// const LEVELS: Record<string, number> = {
//   'all-houses': 1,
//   'all-renters': 1,
//   uikit: 1,
//   house: 2,
//   renter: 3,
//   contract: 2,
// };

// const getLevelByPath = (pathname: string): number => {
//   if (!pathname) return 1;
//   if (pathname.startsWith('/all-houses')) return LEVELS['all-houses'];
//   if (pathname.startsWith('/all-renters')) return LEVELS['all-renters'];
//   if (pathname.startsWith('/uikit')) return LEVELS['uikit'];
//   if (pathname.startsWith('/house')) return LEVELS['house'];
//   if (pathname.startsWith('/renter')) return LEVELS['renter'];
//   if (pathname.startsWith('/contract')) return LEVELS['contract'];
//   return 1;
// };

// export const useBreadcrumbTrail = (pathname: string) => {
//   const segments = pathname.split('/').filter(Boolean);
//   const [crumbs, setCrumbs] = useState<Crumb[]>([]);

//   // Ленивая загрузка
//   const [triggerHouse] = useLazyGetHouseByIdQuery();
//   const [triggerRenter] = useLazyGetRenterByIdQuery();

//   useEffect(() => {
//     if (!pathname) return;

//     const level = getLevelByPath(pathname);
//     let label = STATIC_LABELS[`/${segments[0]}`] || segments[segments.length - 1];

//     const loadDynamicLabel = async () => {
//       if (segments[0] === 'house' && segments[1]) {
//         const result = await triggerHouse(segments[1]).unwrap();
//         if (result?.houseDetail.apartmentName) label = result.houseDetail.apartmentName;
//       }

//       if (segments[0] === 'renter' && segments[1]) {
//         const result = await triggerRenter(segments[1]).unwrap();
//         if (result?.oneRenterReport.firstName) label = result?.oneRenterReport.firstName;
//       }

//       setCrumbs([{ label, href: pathname, level }]);
//     };

//     loadDynamicLabel();
//   }, [pathname, triggerHouse, triggerRenter]);

//   return crumbs;
// };

'use client';

import { useLazyGetHouseByIdQuery, useLazyGetRenterByIdQuery } from '@/store/api/houses-api';
import { useEffect, useState } from 'react';

export type Crumb = {
  label: string;
  href: string;
  level: number;
};

const STORAGE_KEY = 'breadcrumb-trail';

const STATIC_LABELS: Record<string, string> = {
  '/all-houses': 'Всі Квартири',
  '/all-renters': 'Всі Орендарі',
  '/uikit': 'UI Kit',
};

const LEVELS: Record<string, number> = {
  'all-houses': 1,
  'all-renters': 1,
  uikit: 1,
  house: 2,
  renter: 3,
  contract: 2,
};

const getLevelByPath = (pathname: string) => {
  if (!pathname) return 1;
  if (pathname.startsWith('/all-houses')) return LEVELS['all-houses'];
  if (pathname.startsWith('/all-renters')) return LEVELS['all-renters'];
  if (pathname.startsWith('/uikit')) return LEVELS['uikit'];
  if (pathname.startsWith('/house')) return LEVELS['house'];
  if (pathname.startsWith('/renter')) return LEVELS['renter'];
  if (pathname.startsWith('/contract')) return LEVELS['contract'];
  return 1;
};

const localStorageService = {
  load: (): Crumb[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
  save: (crumbs: Crumb[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(crumbs));
    } catch (error) {
      console.error('Failed to add breadcrumb to localstorage', error);
    }
  },
};

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
        if (result?.houseDetail?.apartmentName) label = result.houseDetail.apartmentName;
      }

      if (segments[0] === 'renter' && segments[1]) {
        const result = await triggerRenter(segments[1]).unwrap();
        if (result?.oneRenterReport?.firstName) label = result.oneRenterReport.firstName;
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
