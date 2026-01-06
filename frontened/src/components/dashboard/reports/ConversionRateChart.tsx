import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ConversionRateChartProps {
  data: {
    percentage: number;
    cart: number;
    checkout: number;
    purchase: number;
  };
}

export const ConversionRateChart = ({ data }: ConversionRateChartProps) => {
  const chartData = [
    { name: "Converted", value: data.percentage },
    { name: "Lost", value: 100 - data.percentage },
  ];
  const COLORS = ["#10B981", "#F3F4F6"]; // Emerald-500

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm h-full flex flex-col justify-between">
      <h3 className="text-base font-semibold text-gray-900">Conversion Rate</h3>

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
        <div className="absolute inset-0 flex items-center justify-center ">
          <span className="text-2xl font-bold text-gray-900">
            {data.percentage}%
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Cart:</span>
          <span className="font-semibold text-gray-900">{data.cart}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Checkout:</span>
          <span className="font-semibold text-gray-900">{data.checkout}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Purchase:</span>
          <span className="font-semibold text-gray-900">{data.purchase}%</span>
        </div>
      </div>
    </div>
  );
};
