'use client';

import type { LucideIcon } from 'lucide-react';
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
                'relative transition-all duration-200 ease-out px-3 py-1 rounded-md',
                'hover:bg-accent/15',
                item.isActive && [
                  'bg-gradient-to-r from-[#A692E5]/20 to-transparent',
                  'after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-[3px] after:h-full after:bg-[#A692E5]',
                ],
              )}
            >
              <a
                href={item.url}
                className='group flex items-center gap-2 overflow-hidden'
              >
                {item.icon && (
                  <div className='flex-shrink-0 w-5 h-5 flex items-center justify-center'>
                    <item.icon
                      className={cn(
                        'transition-all duration-200',
                        item.isActive
                          ? 'text-primary'
                          : 'text-muted-foreground/60 group-hover:text-muted-foreground/60',
                      )}
                      size={18}
                      strokeWidth={1.5}
                    />
                  </div>
                )}
                <span
                  className={cn(
                    'transition-all duration-200 transform group-hover:translate-x-0.5',
                    item.isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground/60 group-hover:text-foreground/60',
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
