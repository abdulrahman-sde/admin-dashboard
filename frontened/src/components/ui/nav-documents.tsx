"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";

export function NavDocuments({
  items,
  label = "Documents",
}: {
  items: {
    name: string;
    url: string;
    icon: string;
  }[];
  label?: string;
}) {
  const location = useLocation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden mb-[-15px]">
      <SidebarGroupLabel className="text-[15px]">{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = location.pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="data-[active=true]:bg-primary data-[active=true]:text-white"
              >
                <Link to={item.url}>
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={`size-[17.5px]`}
                  />

                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
