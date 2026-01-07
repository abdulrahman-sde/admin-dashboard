import { useAverageOrderValue } from "@/hooks/reports/useAverageOrderValue";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

import type { AvgOrderValueData } from "@/types/reports";

interface AverageOrderValueChartProps {
  data: AvgOrderValueData;
}

export const AverageOrderValueChart = ({
  data,
}: AverageOrderValueChartProps) => {
  const { last4DaysTrend, last4DaysAvg } = useAverageOrderValue(data);

  return (
    <div className="bg-white p-6 h-full rounded-2xl">
      <h3 className="text-base font-semibold text-gray-900">
        Average Order Value
      </h3>

      <div className="mt-2 flex items-baseline gap-4 mb-6">
        <div className="flex gap-2 text-sm">
          <span className="text-gray-500">This Month</span>
          <span className="font-bold text-gray-900">
            ${data.thisMonth.toFixed(2)}
          </span>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-gray-500">Last 4 Days</span>
          <span className="font-bold text-gray-900">
            ${last4DaysAvg.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={last4DaysTrend}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Value"]}
              itemStyle={{ color: "#10B981" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
        {last4DaysTrend.map(
          (item: { time: string; value: number }, i: number) => (
            <span key={i}>{item.time}</span>
          )
        )}
      </div>
    </div>
  );
};
