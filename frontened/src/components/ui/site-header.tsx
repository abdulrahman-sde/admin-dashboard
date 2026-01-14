import { SearchInput } from "../dashboard/SearchInput";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/components/ui/sidebar";
import togglerIcon from "@/assets/icons/toggler.svg";
import { useLocation } from "react-router";

const getPageTitle = (pathname: string) => {
  const routes: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/orders": "Order Management",
    "/dashboard/customers": "Customers",
    "/dashboard/coupons": "Coupon",
    "/dashboard/categories": "Categories",
    "/dashboard/transactions": "Transaction",
    "/dashboard/reports": "Reports",
    "/dashboard/products": "Product List",
    "/dashboard/products/add": "Add Products",
    "/dashboard/admin": "Admin role",
  };

  return routes[pathname] || "Dashboard";
};

export function SiteHeader() {
  const { user } = useAuth();
  const { toggleSidebar, open } = useSidebar();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="flex h-[70px] md:h-[79px] -mt-1.5 items-center bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="flex w-full items-center gap-3 px-4 lg:gap-4 lg:px-6">
        {!open && (
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
          >
            <img src={togglerIcon} alt="Toggle sidebar" className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-semibold text-gray-900 flex-shrink-0 min-w-fit">
          {pageTitle}
        </h2>
        <div className="flex-1 flex justify-end">
          <SearchInput />
        </div>
        <div className="flex gap-3 items-center flex-shrink-0">
          <img
            src={user?.avatar || "https://github.com/shadcn.png"}
            alt="user photo"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        </div>
      </div>
    </header>
  );
}
