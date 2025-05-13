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
                'hover:bg-accent/40 text-muted-foreground/70',
                item.isActive && 'bg-accent/40 text-[#d3cbf4]'
              )}
            >
              <a href={item.url}>
                {item.icon && (
                  <item.icon
                    className={cn(
                      
                      item.isActive
                        && 'text-[#d3cbf4]'

                    )}
                  />
                )}
                <span
                  className={cn(
                 item.isActive
                        && 'text-[#d3cbf4]'
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
