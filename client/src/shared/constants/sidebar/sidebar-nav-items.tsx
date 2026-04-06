import { ROUTES } from '@/shared/routes';
import { FileStackIcon } from '@/shared/ui/file-stack';
import { HomeIcon } from '@/shared/ui/home';
import { MapPinIcon } from '@/shared/ui/map-pin';
import { UsersIcon } from '@/shared/ui/users';
import { NavItem } from '@/types/model/navigation';

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
    title: 'Карта',
    url: ROUTES.MAP,
    icon: <MapPinIcon size={16} />,
  },
];
