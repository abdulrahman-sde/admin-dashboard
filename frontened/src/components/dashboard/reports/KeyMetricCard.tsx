import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeyMetricCardProps {
  title: string;
  value: string;
  change: number;
  isPositive: boolean;
}

export function KeyMetricCard({
  title,
  value,
  change,
  isPositive,
}: KeyMetricCardProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-emerald-500" : "text-rose-500"
            )}
          >
            <span className="">{Math.abs(change).toFixed(2)}%</span>
            {isPositive ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
