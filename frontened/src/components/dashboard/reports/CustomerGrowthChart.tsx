import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CustomerGrowthChartProps {
  data: {
    month: string;
    newCustomers: number;
    returningCustomers: number;
  }[];
}

export const CustomerGrowthChart = ({ data }: CustomerGrowthChartProps) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">
          Customer Growth
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
          <span>Last 12 Months</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="left"
              iconType="square"
              iconSize={8}
              wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }}
            />
            <Bar
              dataKey="returningCustomers"
              name="Returning customers"
              fill="#D7DBEC"
              radius={[4, 4, 4, 4]}
              barSize={8}
              isAnimationActive={true}
            />
            <Bar
              dataKey="newCustomers"
              name="New customers"
              fill="#4EA674"
              radius={[4, 4, 4, 4]}
              barSize={8}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
