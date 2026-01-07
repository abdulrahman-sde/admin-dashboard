import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useSalesGoal } from "@/hooks/reports/useSalesGoal";

import type { SalesGoalData } from "@/types/reports";

interface SalesGoalChartProps {
  data: SalesGoalData;
}

export const SalesGoalChart = ({ data }: SalesGoalChartProps) => {
  const { chartData, COLORS } = useSalesGoal(data);

  return (
    <div className="bg-white p-6 h-full flex flex-col justify-between rounded-2xl">
      <h3 className="text-base font-semibold text-gray-900 ">Sales Goal</h3>

      <div className="relative h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={60}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {data.percentage}%
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Sold for:</span>
          <span className="font-semibold text-gray-900">
            ${data.soldFor.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Month goal:</span>
          <span className="font-semibold text-gray-900">
            ${data.monthGoal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Left:</span>
          <span className="font-semibold text-gray-900">
            ${data.left.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
