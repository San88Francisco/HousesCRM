import { KeyboardEvent } from 'react';

export const createRowKeyDown =
  (onRowActivate: () => void) => (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;

    const target = e.target as HTMLElement;

    if (target !== e.currentTarget && target.tabIndex >= 0) {
      return;
    }

    e.preventDefault();
    onRowActivate();
  };
