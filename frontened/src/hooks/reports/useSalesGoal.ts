import { useMemo } from "react";
import type { SalesGoalData } from "@/types/reports";

export function useSalesGoal(data: SalesGoalData) {
  const chartData = useMemo(() => {
    return [
      { name: "Achieved", value: Math.min(data.soldFor, data.monthGoal) },
      { name: "Remaining", value: Math.max(0, data.monthGoal - data.soldFor) },
    ];
  }, [data.soldFor, data.monthGoal]);

  const COLORS = ["#F59E0B", "#F3F4F6"];

  return {
    chartData,
    COLORS,
  };
}
