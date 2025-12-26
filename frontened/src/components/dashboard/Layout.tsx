import { SiteHeader } from "@/components/ui/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "./app-sidebar";

export default function Layout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 66)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="bg-background px-4 pt-8 pb-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
