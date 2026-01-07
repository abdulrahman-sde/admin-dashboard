import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerGrowthChartProps {
  data: {
    month: string;
    newCustomers: number;
    returningCustomers: number;
  }[];
  onTimeRangeChange?: (range: string) => void;
  selectedRange?: string;
}

export const CustomerGrowthChart = ({
  data,
  onTimeRangeChange,
  selectedRange = "12_months",
}: CustomerGrowthChartProps) => {
  return (
    <div className="bg-white p-6 h-full rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">
          Customer Growth
        </h3>
        <div className="flex items-center gap-2">
          <Select value={selectedRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-[180px] h-8 text-sm text-[#8E92BC] border-none bg-transparent shadow-none focus:ring-0 hover:bg-gray-50">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12_months">Last 12 Months</SelectItem>
              <SelectItem value="9_months">Last 9 Months</SelectItem>
              <SelectItem value="6_months">Last 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F3FB"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8E92BC", fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="left"
              iconType="square"
              iconSize={8}
              wrapperStyle={{
                paddingLeft: "32px",
                paddingBottom: "20px",
                fontSize: "12px",
                color: "#8E92BC",
              }}
            />
            <Bar
              dataKey="returningCustomers"
              name="Returning customers"
              fill="#D7DBEC"
              radius={[2, 2, 0, 0]}
              barSize={8}
              isAnimationActive={true}
            />
            <Bar
              dataKey="newCustomers"
              name="New customers"
              fill="#10B981"
              radius={[2, 2, 0, 0]}
              barSize={8}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
