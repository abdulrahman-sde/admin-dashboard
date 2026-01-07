import { ArrowUp, ArrowDown } from "lucide-react";

interface KeyMetricCardProps {
  title: string;
  value: string;
  change: number;
  isPositive: boolean;
  className?: string;
  subtitle?: string;
}

export const KeyMetricCard = ({
  title,
  value,
  change,
  isPositive,
  className,
  subtitle,
}: KeyMetricCardProps) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {subtitle && (
          <span className="text-[10px] text-gray-400 font-normal bg-gray-50 px-1.5 py-0.5 rounded">
            {subtitle}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        <span
          className={`flex items-center text-xs font-medium ${
            isPositive ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {Math.floor(Math.abs(change))}%
          {isPositive ? (
            <ArrowUp className="h-3 w-3 ml-0.5" />
          ) : (
            <ArrowDown className="h-3 w-3 ml-0.5" />
          )}
          <span className="ml-1 text-gray-400 font-normal">vs last month</span>
        </span>
      </div>
    </div>
  );
};
