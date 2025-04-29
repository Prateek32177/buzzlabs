'use client';

import { type LucideIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton
              tooltip={item.title}
              asChild
              className={cn(
                item.isActive && 'bg-accent text-accent-foreground',
              )}
            >
              <a href={item.url}>
                {item.icon && (
                  <item.icon
                    className={cn(
                      item.isActive
                        ? 'text-accent-foreground'
                        : 'text-muted-foreground',
                    )}
                  />
                )}
                <span
                  className={cn(
                    item.isActive ? 'font-semibold' : 'font-normal',
                  )}
                >
                  {item.title}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
