import { Search } from "lucide-react";

export function SearchInput() {
  return (
    <div className="relative flex items-center md:bg-background  rounded-[50px] w-full md:w-[220px] lg:w-[380px] h-11 md:shadow-xs">
      <input
        type="text"
        placeholder="Search data, users, or reports"
        className="hidden md:block w-full bg-transparent border-0 outline-none px-[27px] pr-10 text-sm placeholder:text-muted-foreground"
      />
      <div className="flex items-center  justify-center md:absolute md:right-4 w-full md:w-auto pointer-events-none">
        <Search size={20} className="text-muted-foreground" />
      </div>
    </div>
  );
}
