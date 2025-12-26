import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { siteHeaderHeadings } from "@/constants/constants";
import { useLocation } from "react-router";
import { SearchInput } from "../dashboard/SearchInput";
import userImage from "@/assets/images/user.png";

export function SiteHeader() {
  const pathname = useLocation().pathname.split("/")[2] || "dashboard";
  console.log("pathname:", pathname);
  return (
    <header className="flex h-[70px]  md:h-[79px]  -mt-1.5 items-center  bg-white sticky top-0 z-50 ">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex justify-between items-center w-full">
          <h2>
            {siteHeaderHeadings[pathname as keyof typeof siteHeaderHeadings]}
          </h2>
          <div className="flex gap-4 items-center">
            <SearchInput />
            <img
              src={userImage}
              alt="user photo"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
