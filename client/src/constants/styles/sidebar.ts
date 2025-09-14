export const SIDEBAR_STYLES = {
  menuItem: {
    base: 'pl-7 py-0.5 hover:bg-bg-input hover:rounded-[12px]',
    collapsed:
      'group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:hover:bg-bg-input group-data-[collapsible=icon]:hover:rounded-[12px]',
    active:
      'bg-muted-foreground group-data-[collapsible=icon]:rounded-[12px] group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 group-data-[collapsible=icon]:justify-center',
  },

  collapsible: {
    container: 'flex flex-col w-full',
    header: 'flex items-center text-text gap-2 pl-[13px] py-2 hover:bg-bg-input rounded-[12px]',
    headerCollapsed:
      'group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:hover:bg-transparent',
    button: 'p-0',
    chevron: 'transition-transform duration-300',
    chevronRotated: 'rotate-90',
    iconContainer: 'flex items-center gap-2',
    contentWrapper: 'overflow-hidden',
    content: 'flex flex-col gap-2 mt-2 w-full',
    link: 'text-text rounded-[12px] hover:bg-bg-input pl-[60px] py-2',
  },

  sidebarGroup: {
    base: 'group-data-[collapsible=icon]:items-center',
    menu: 'group-data-[collapsible=icon]:items-center',
    hidden: 'group-data-[collapsible=icon]:hidden',
  },

  animations: {
    collapsible: {
      height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number] },
      opacity: { duration: 0.2, ease: 'easeOut' as const },
    },
  },
} as const;

export const getSidebarMenuItemClasses = (isActive: boolean) => {
  const baseClasses = `${SIDEBAR_STYLES.menuItem.base} ${SIDEBAR_STYLES.menuItem.collapsed}`;
  const activeClasses = isActive ? SIDEBAR_STYLES.menuItem.active : '';

  return `${baseClasses} ${activeClasses}`.trim();
};

export const getCollapsibleHeaderClasses = () => {
  return `${SIDEBAR_STYLES.collapsible.header} ${SIDEBAR_STYLES.collapsible.headerCollapsed}`;
};

export const getChevronClasses = (isOpen: boolean) => {
  return `${SIDEBAR_STYLES.collapsible.chevron} ${isOpen ? SIDEBAR_STYLES.collapsible.chevronRotated : ''}`;
};
