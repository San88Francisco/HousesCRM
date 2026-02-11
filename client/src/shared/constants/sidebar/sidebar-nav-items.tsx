import { ROUTES } from '@/shared/routes';
import { FileStackIcon } from '@/shared/ui/file-stack';
import { HomeIcon } from '@/shared/ui/home';
import { UsersIcon } from '@/shared/ui/users';
import { NavItem } from '@/types/model/navigation';
import { Cookie } from 'lucide-react';

export const itemsNav: NavItem[] = [
  {
    title: 'Всі Квартири',
    url: ROUTES.ALL_HOUSES,
    icon: <HomeIcon size={16} />,
  },
  {
    title: 'Всі Орендарі',
    url: ROUTES.ALL_RENTERS,
    icon: <UsersIcon size={16} />,
  },
  {
    title: 'Всі Договори',
    url: ROUTES.ALL_CONTRACTS,
    icon: <FileStackIcon size={16} />,
  },
  {
    title: 'UI Kit',
    url: ROUTES.UIKIT,
    icon: <Cookie size={16} />,
  },
];
