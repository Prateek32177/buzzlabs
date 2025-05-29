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
  }[];
}) {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className='text-xs font-semibold text-muted-foreground/70 px-3 pb-1 pt-2'>
          Platform
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.slice(0, 4).map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className={cn(
                  'relative transition-all duration-200 ease-out px-3 py-1.5',
                  'hover:bg-zinc-700/40',
                  item.isActive && [
                    'bg-gradient-to-r from-[#A692E5]/20 to-[#A692E5]/5',
                    'after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-[2px] after:h-full after:bg-[#baa7f7]',
                  ],
                )}
              >
                <a
                  href={item.url}
                  className='group flex items-center gap-2 overflow-hidden'
                >
                  {item.icon && (
                    <item.icon
                      className={cn(
                        'transition-all duration-200',
                        item.isActive
                          ? 'text-[#A692E5]'
                          : 'text-zinc-400 group-hover:text-zinc-300',
                      )}
                      size={18}
                      strokeWidth={1.5}
                    />
                  )}
                  <span
                    className={cn(
                      'text-sm transition-all duration-200 transform',
                      item.isActive
                        ? 'text-white font-medium'
                        : 'text-zinc-400 group-hover:text-white',
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

      <SidebarGroup>
        <SidebarGroupLabel className='text-xs font-semibold text-muted-foreground/70 px-3 pb-1 pt-3'>
          Other
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.slice(4).map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className='px-3 py-1.5 rounded-md hover:bg-zinc-700/30 transition-colors duration-200'
              >
                <a
                  href={item.url}
                  className='group flex items-center gap-2 overflow-hidden'
                >
                  {item.icon && (
                    <item.icon
                      className='text-zinc-400 group-hover:text-zinc-300'
                      size={18}
                      strokeWidth={1.5}
                    />
                  )}
                  <span className='text-sm text-zinc-400 group-hover:text-white'>
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
