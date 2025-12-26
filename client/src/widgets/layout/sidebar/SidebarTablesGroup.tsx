'use client';

import { SIDEBAR_STYLES } from '@/shared/constants/styles';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar';
import { useGetHousesAnalyticsQuery } from '@/store/houses-api';
import { MapPinHouse } from 'lucide-react';
import { CollapsibleMenu } from './ColapsibleMenu';

export const SidebarTablesGroup = () => {
  const { data, error, isLoading } = useGetHousesAnalyticsQuery();
  const colapsibleMenuItems =
    data?.housesOverview?.map(house => ({
      title: house.apartmentName,
      url: `/apartment/${house.id}`,
      icon: MapPinHouse,
    })) || [];

  return (
    <SidebarGroup className={SIDEBAR_STYLES.sidebarGroup.hidden}>
      <SidebarGroupLabel>Таблиці</SidebarGroupLabel>
      <SidebarGroupContent>
        {isLoading && <div>Loading...</div>}
        {error && colapsibleMenuItems.length === 0 && <div>Щось пішло не так</div>}
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
