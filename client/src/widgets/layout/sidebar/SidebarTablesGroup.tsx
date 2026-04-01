'use client';

import { SIDEBAR_STYLES } from '@/shared/constants/styles/sidebar';
import { ROUTES } from '@/shared/routes';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar';
import { useGetHousesQuery } from '@/store/api/houses-api';
import { MapPinHouse } from 'lucide-react';
import { CollapsibleMenu } from './ColapsibleMenu';

export const SidebarTablesGroup = () => {
  const { data, error, isLoading } = useGetHousesQuery();
  const colapsibleMenuItems =
    data?.data.map(house => ({
      title: house.apartmentName,
      url: `${ROUTES.HOUSE}/${house.id}`,
      icon: MapPinHouse,
    })) || [];

  return (
    <SidebarGroup className={SIDEBAR_STYLES.sidebarGroup.hidden}>
      <SidebarGroupContent>
        {isLoading && <div>Loading...</div>}
        {error && <div>Щось пішло не так</div>}
        {!isLoading && !error && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Квартири">
                <CollapsibleMenu title="Квартири" items={colapsibleMenuItems} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
