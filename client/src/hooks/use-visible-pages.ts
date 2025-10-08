import { useMemo } from 'react';

const useVisiblePages = (currentPageIndex: number, totalPages: number) => {
  return useMemo((): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    if (currentPageIndex <= 3) {
      return [
        0,
        ...Array.from({ length: 4 }, (_, i) => i + 1),
        'ellipsis' as const,
        totalPages - 1,
      ];
    }

    if (currentPageIndex >= totalPages - 4) {
      return [
        0,
        'ellipsis' as const,
        ...Array.from({ length: 5 }, (_, i) => totalPages - 5 + i).filter(page => page > 0),
      ];
    }

    return [
      0,
      'ellipsis' as const,
      ...Array.from({ length: 3 }, (_, i) => currentPageIndex - 1 + i),
      'ellipsis' as const,
      totalPages - 1,
    ];
  }, [currentPageIndex, totalPages]);
};

export default useVisiblePages;
