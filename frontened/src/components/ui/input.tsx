import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#A1A7C4] placeholder:text-[15.5px] placeholder:font-normal border border-[#D9E1EC] bg-[#F9FAFB] rounded-xl w-full min-w-0 px-3 py-1 text-base h-[45px] transition-all outline-none ring-0 focus:ring-0 focus:outline-none focus:border-[#4EA674] focus:bg-[#F9FAFB] file:inline-flex file:h-7 file:border-0 file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-none",
        "aria-invalid:ring-0 aria-invalid:border aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
