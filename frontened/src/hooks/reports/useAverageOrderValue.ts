import { useMemo } from "react";
import type { AvgOrderValueData } from "@/types/reports";

export function useAverageOrderValue(data: AvgOrderValueData) {
  const last4DaysTrend = useMemo(() => {
    if (!data?.trend) return [];
    return data.trend;
  }, [data?.trend]);

  const last4DaysAvg = useMemo(() => {
    if (last4DaysTrend.length === 0) return 0;
    const sum = last4DaysTrend.reduce((acc, curr) => acc + curr.value, 0);
    return sum / last4DaysTrend.length;
  }, [last4DaysTrend]);

  return {
    last4DaysTrend,
    last4DaysAvg,
  };
}
