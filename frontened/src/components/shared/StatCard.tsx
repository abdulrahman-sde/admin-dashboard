import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowUp, ArrowDown, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  change?: {
    value: number | string;
    isPositive: boolean;
  };
  className?: string;
  isLoading?: boolean;
}

const formatValue = (
  val: number | string | undefined,
  title: string
): string => {
  if (val === undefined || val === null) return "0";
  if (typeof val === "string") return val;

  const isCurrency =
    title.toLowerCase().includes("revenue") ||
    title.toLowerCase().includes("amount") ||
    title.toLowerCase().includes("sales");

  if (val >= 1000) {
    const formatted = (val / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return isCurrency ? `$${formatted}` : formatted;
  }

  return isCurrency ? `$${val.toLocaleString()}` : val.toLocaleString();
};

export function StatCard({
  title,
  value,
  subtitle = "Last 7 days",
  change,
  className,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card
        className={cn("relative px-2 py-5 gap-1 shadow-sm border-0", className)}
      >
        <CardHeader className="flex flex-row items-center justify-between px-4 pb-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </CardHeader>
        <CardContent className="px-4">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = change?.isPositive;
  const changeValue =
    typeof change?.value === "number" ? change.value.toFixed(1) : change?.value;

  return (
    <Card
      className={cn("relative px-2 py-5 gap-1 shadow-sm border-0", className)}
    >
      <CardHeader className="flex flex-row items-start justify-between px-4 pb-2">
        <h3 className="text-[17px] font-bold text-[#1e293b]">{title}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-neutral-400 -mt-2 -mr-2"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-[32px] font-bold text-[#0f365d] leading-tight tracking-tight">
            {formatValue(value, title)}
          </h1>
          {change && (
            <div
              className={cn(
                "flex items-center text-[13.5px] font-bold mt-2",
                isPositive ? "text-[#10b981]" : "text-[#ef4444]"
              )}
            >
              {isPositive ? (
                <ArrowUp
                  className="w-3.5 h-3.5 mr-0.5 fill-current"
                  strokeWidth={3}
                />
              ) : (
                <ArrowDown
                  className="w-3.5 h-3.5 mr-0.5 fill-current"
                  strokeWidth={3}
                />
              )}
              {changeValue}
              {typeof changeValue === "string" && changeValue.includes("%")
                ? ""
                : "%"}
            </div>
          )}
        </div>
        <p className="text-[14px] text-neutral-400 font-medium">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
