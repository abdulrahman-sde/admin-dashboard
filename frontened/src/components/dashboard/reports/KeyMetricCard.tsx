import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeyMetricCardProps {
  title: string;
  value: string;
  change: number;
  isPositive: boolean;
  className?: string;
}

export function KeyMetricCard({
  title,
  value,
  change,
  isPositive,
  className,
}: KeyMetricCardProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 py-2", className)}>
      <h3 className="text-[13px] font-medium text-[#8E92BC]">{title}</h3>
      <div className="flex flex-col gap-1">
        <span className="text-[22px] font-bold text-gray-900 leading-tight">
          {value}
        </span>
        <div
          className={cn(
            "flex items-center gap-1 text-[13px] font-medium",
            isPositive ? "text-[#4EA674]" : "text-[#E63946]"
          )}
        >
          <span>{Math.abs(change).toFixed(2)}%</span>
          {isPositive ? (
            <ArrowUp className="h-3.5 w-3.5 stroke-[2.5px]" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 stroke-[2.5px]" />
          )}
        </div>
      </div>
    </div>
  );
}
