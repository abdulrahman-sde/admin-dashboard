import { ArrowUp, ArrowDown } from "lucide-react";

interface KeyMetricCardProps {
  title: string;
  value: string;
  change: number;
  isPositive: boolean;
  className?: string;
}

export const KeyMetricCard = ({
  title,
  value,
  change,
  isPositive,
  className,
}: KeyMetricCardProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        <span
          className={`flex items-center text-xs font-medium ${
            isPositive ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {Math.abs(change).toFixed(2)}%
          {isPositive ? (
            <ArrowUp className="h-3 w-3 ml-0.5" />
          ) : (
            <ArrowDown className="h-3 w-3 ml-0.5" />
          )}
        </span>
      </div>
    </div>
  );
};
