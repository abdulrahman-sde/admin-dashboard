import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface SalesGoalChartProps {
  data: {
    percentage: number;
    soldFor: number;
    monthGoal: number;
    left: number;
  };
}

export const SalesGoalChart = ({ data }: SalesGoalChartProps) => {
  const chartData = [
    { name: "Achieved", value: Math.min(data.soldFor, data.monthGoal) },
    { name: "Remaining", value: Math.max(0, data.monthGoal - data.soldFor) },
  ];
  const COLORS = ["#F59E0B", "#F3F4F6"]; // Amber-500

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm h-full flex flex-col justify-between">
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
