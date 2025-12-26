import * as React from "react";
import {
  IconShoppingCart,
  IconUsers,
  IconTicket,
  IconCategory,
  IconCreditCard,
  IconFileText,
  IconPlus,
  IconList,
  IconUserCog,
  IconHome,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/ui/nav-documents";
import { NavUser } from "@/components/ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import logoImage from "@/assets/images/logo.svg";

const data = {
  user: {
    name: "Dealport",
    email: "Mark@thedesigner...",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      name: "Order Management",
      url: "/dashboard/orders",
      icon: IconShoppingCart,
    },
    {
      name: "Customers",
      url: "/dashboard/customers",
      icon: IconUsers,
    },
    {
      name: "Coupon",
      url: "/dashboard/coupons",
      icon: IconTicket,
    },
    {
      name: "Categories",
      url: "/dashboard/categories",
      icon: IconCategory,
    },
    {
      name: "Transaction",
      url: "/dashboard/transactions",
      icon: IconCreditCard,
    },
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: IconFileText,
    },
  ],
  navProducts: [
    {
      name: "Add Products",
      url: "/dashboard/products/add",
      icon: IconPlus,
    },
    {
      name: "Product List",
      url: "/dashboard/products",
      icon: IconList,
    },
  ],
  navAdmin: [
    {
      name: "Admin role",
      url: "/dashboard/admin",
      icon: IconUserCog,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="bg-white border-r pr-1 border-gray-100 "
    >
      <SidebarHeader className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to={"/dashboard"}>
                <img src={logoImage} alt="Logo" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavDocuments label="Main menu" items={data.navMain} />
        <NavDocuments label="Product" items={data.navProducts} />
        <NavDocuments label="Admin" items={data.navAdmin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
