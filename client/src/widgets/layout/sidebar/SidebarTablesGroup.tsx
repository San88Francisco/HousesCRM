'use client';

import { SIDEBAR_STYLES } from '@/shared/constants/styles';
import {
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@/shared/ui/sidebar';
import { CollapsibleMenu } from './ColapsibleMenu';
import { useGetHousesAnalyticsQuery } from '@/store/houses-api';

export const SidebarTablesGroup = () => {
  const { data, error, isLoading } = useGetHousesAnalyticsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Щось пішло не так</div>;

  const colapsibleMenuItems =
    data?.housesOverview?.map(house => ({
      title: house.apartmentName,
      url: `/apartment/${house.id}`,
    })) || [];

  return (
    <SidebarGroup className={SIDEBAR_STYLES.sidebarGroup.hidden}>
      <SidebarGroupLabel>Таблиці</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Квартири">
              <CollapsibleMenu title="Квартири" items={colapsibleMenuItems} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
