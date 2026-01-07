import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-[#A1A7C4] placeholder:text-[15.5px] placeholder:font-normal border border-[#D9E1EC] bg-[#F9FAFB] flex field-sizing-content min-h-24 w-full rounded-xl px-3 py-2 text-base transition-all outline-none ring-0 focus:ring-0 focus:outline-none focus:border-[#4EA674] focus:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-none",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
