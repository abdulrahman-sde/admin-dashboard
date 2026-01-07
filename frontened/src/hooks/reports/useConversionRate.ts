import { useMemo } from "react";
import type { ConversionRateData } from "@/types/reports";

export function useConversionRate(data: ConversionRateData) {
  const chartData = useMemo(() => {
    return [
      { name: "Converted", value: data.percentage },
      { name: "Lost", value: 100 - data.percentage },
    ];
  }, [data.percentage]);

  const COLORS = ["#10B981", "#F3F4F6"];

  return {
    chartData,
    COLORS,
  };
}
