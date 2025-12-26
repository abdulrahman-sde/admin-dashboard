import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDown, ArrowUp, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  subtitle?: string;
  value?: number | string;
  label?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  previousValue?: number | string;
  onDetailsClick?: () => void;
  className?: string;
  isLoading?: boolean;
  variant?: "default" | "split";
  // Props for split variant
  splitData?: {
    left: {
      label: string;
      value: number | string;
      subValue?: string;
      subValueColor?: string;
    };
    right: {
      label: string;
      value: number | string;
      change?: {
        value: number;
        isPositive: boolean;
      };
    };
  };
}

const formatValue = (val: number | string | undefined): string => {
  if (val === undefined || val === null) return "0";
  if (typeof val === "string") return val;
  if (val >= 1000) {
    return (val / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return val.toString();
};

export function StatsCard({
  title,
  subtitle = "Last 7 days",
  value,
  label,
  change,
  previousValue,
  onDetailsClick,
  className,
  isLoading = false,
  variant = "default",
  splitData,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card
        className={cn("relative px-2 py-5 gap-1 shadow-sm border-0", className)}
      >
        <CardHeader className="flex flex-row items-center justify-between px-4 pb-5 -mb-2">
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-5 w-5 rounded-full" />
        </CardHeader>
        <CardContent className="px-4">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-1/2 mb-6" />
          <div className="flex justify-end">
            <Skeleton className="h-[30px] w-[88px] rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn("relative px-2 py-5 gap-1 shadow-sm border-0", className)}
    >
      <CardHeader className="flex flex-row items-start justify-between px-4 pb-5 -mb-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[17px] font-bold text-[#1e293b]">{title}</h3>
          <p className="text-[14px] text-neutral-400 font-medium">{subtitle}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-neutral-400 -mt-1 -mr-2"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="px-4">
        {variant === "default" ? (
          <>
            <div className="flex items-center flex-row gap-2 mt-1">
              <h1 className="text-[32px] font-bold text-[#0f172a] leading-tight tracking-tight">
                {title.toLowerCase().includes("sales") ? "$" : ""}
                {formatValue(value)}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                {label && (
                  <span className="text-[15px] font-semibold text-neutral-600">
                    {label}
                  </span>
                )}
                {change && (
                  <div
                    className={cn(
                      "flex items-center text-[13.5px] font-bold",
                      change.isPositive ? "text-[#10b981]" : "text-[#ef4444]"
                    )}
                  >
                    {change.isPositive ? (
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
                    {change.value.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2">
              {previousValue !== undefined && (
                <p className="text-[14px] text-neutral-400 font-medium">
                  Previous 7days{" "}
                  <span className="text-[#6366f1] font-bold">
                    ({title.toLowerCase().includes("sales") ? "$" : ""}
                    {formatValue(previousValue)})
                  </span>
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-1 border-gray-100">
            <div className="flex flex-col border-r border-[#f1f5f9] pr-4">
              <span className="text-[14px] font-semibold text-neutral-700 mb-1">
                {splitData?.left.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-bold text-[#0f365d]">
                  {splitData?.left.value}
                </span>
                {splitData?.left.subValue && (
                  <span
                    className={cn(
                      "text-[13px] font-bold",
                      splitData.left.subValueColor || "text-[#10b981]"
                    )}
                  >
                    {splitData.left.subValue}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col pl-2">
              <span className="text-[14px] font-semibold text-neutral-700 mb-1">
                {splitData?.right.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[26px] font-bold text-[#ef4444]">
                  {splitData?.right.value}
                </span>
                {splitData?.right.change && (
                  <div
                    className={cn(
                      "flex items-center text-[13px] font-bold",
                      splitData.right.change.isPositive
                        ? "text-[#10b981]"
                        : "text-[#fca5a5]"
                    )}
                  >
                    {splitData.right.change.isPositive ? (
                      <ArrowUp className="w-3.5 h-3.5 mr-0.5" strokeWidth={3} />
                    ) : (
                      <ArrowDown
                        className="w-3.5 h-3.5 mr-0.5"
                        strokeWidth={3}
                      />
                    )}
                    {splitData.right.change.value.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onDetailsClick}
            className="text-[#6366f1] h-[34px] px-6 border-[#6366f1] border hover:bg-[#6366f1] hover:text-white transition-all duration-200 text-[14px] font-bold rounded-full bg-transparent"
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
