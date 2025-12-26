import { NavItem } from '@/types/navigation';
import { ROUTES } from '@/shared/routes';
// import { KeySquareIcon } from '@/shared/ui/key';
import { HomeIcon } from '@/shared/ui/home';
import { Cookie } from 'lucide-react';

export const itemsNav: NavItem[] = [
  {
    title: 'Всі Квартири',
    url: ROUTES.ALL_APARTMENTS,
    icon: <HomeIcon size={16} />,
  },
  {
    title: 'UI Kit',
    url: ROUTES.UIKIT,
    icon: <Cookie size={16} />,
  },
];
