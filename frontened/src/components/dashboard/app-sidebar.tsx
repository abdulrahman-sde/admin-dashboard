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
import homeIcon from "@/assets/icons/home.svg";
import orderIcon from "@/assets/icons/orders.svg";
import usersIcon from "@/assets/icons/users.svg";
import transactionIcon from "@/assets/icons/card.svg";
import couponIcon from "@/assets/icons/coupon.svg";
import categoryIcon from "@/assets/icons/categories.svg";
import reportsIcon from "@/assets/icons/reports.svg";
import addProductIcon from "@/assets/icons/add.svg";
import productIcon from "@/assets/icons/products.svg";
import adminIcon from "@/assets/icons/user.svg";
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
      icon: homeIcon,
    },
    {
      name: "Order Management",
      url: "/dashboard/orders",
      icon: orderIcon,
    },
    {
      name: "Customers",
      url: "/dashboard/customers",
      icon: usersIcon,
    },
    {
      name: "Coupon",
      url: "/dashboard/coupons",
      icon: couponIcon,
    },
    {
      name: "Categories",
      url: "/dashboard/categories",
      icon: categoryIcon,
    },
    {
      name: "Transaction",
      url: "/dashboard/transactions",
      icon: transactionIcon,
    },
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: reportsIcon,
    },
  ],
  navProducts: [
    {
      name: "Add Products",
      url: "/dashboard/products/add",
      icon: addProductIcon,
    },
    {
      name: "Product List",
      url: "/dashboard/products",
      icon: productIcon,
    },
  ],
  navAdmin: [
    {
      name: "Admin role",
      url: "/dashboard/admin",
      icon: adminIcon,
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
