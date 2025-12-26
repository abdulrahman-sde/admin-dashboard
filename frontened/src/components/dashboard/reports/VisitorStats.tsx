import { Card, CardContent } from "@/components/ui/card";
import type { VisitorStatsProps } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";

export function VisitorStats({ data }: VisitorStatsProps) {
  return (
    <Card className="w-full border-none shadow-none bg-white">
      <CardContent className="px-8 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-gray-100">
          {data.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col gap-2 ${index !== 0 ? "lg:pl-8" : ""} ${
                index !== data.length - 1 ? "lg:pr-8" : ""
              }`}
            >
              <span className="text-muted-foreground text-sm font-medium">
                {item.title}
              </span>
              <div className="flex flex-col gap-1">
                <h2 className=" text-[#131523] tracking-tight">{item.value}</h2>
                <div
                  className={`flex items-center text-[14px]  ${
                    item.isPositive ? "text-rise" : "text-destructive"
                  }`}
                >
                  {item.change}
                  {item.isPositive ? (
                    <ChevronUp className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <ChevronDown className="h-4 w-4" strokeWidth={3} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
