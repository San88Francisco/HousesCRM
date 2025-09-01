export const TABS_SIZE_CONFIG = {
  sm: {
    '--tabs-list-min-h': '1.25rem',
    '--tabs-list-p': '2px',
    '--tabs-trigger-px': '0.375rem',
    '--tabs-trigger-py': '0.125rem',
    '--tabs-trigger-fs': '0.75rem',
    '--tabs-content-mt': '0.25rem',
    '--tabs-after-h': '1.5px',
  },
  default: {
    '--tabs-list-min-h': '2.5rem',
    '--tabs-list-p': '0.25rem',
    '--tabs-trigger-px': '0.75rem',
    '--tabs-trigger-py': '4px',
    '--tabs-trigger-fs': '0.875rem',
    '--tabs-content-mt': '0.5rem',
    '--tabs-after-h': '2px',
  },
} as const;

export type TabsSize = keyof typeof TABS_SIZE_CONFIG;
