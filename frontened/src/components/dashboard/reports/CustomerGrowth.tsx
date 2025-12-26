import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomerGrowthProps } from "@/types";

export function CustomerGrowth({ data }: CustomerGrowthProps) {
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 p-0 pb-6">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-base font-bold">Customer Growth</CardTitle>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[14px]">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-xs bg-[#E2E8F0]"></span>
              <span className="text-gray-500">Returning customers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-xs bg-[#22c55e]"></span>
              <span className="text-gray-500">New customers</span>
            </div>
          </div>
        </div>
        <Select defaultValue="12months">
          <SelectTrigger className="w-full sm:w-[140px] border-none shadow-none text-gray-500 hover:text-gray-900 bg-transparent focus:ring-0">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12months">Last 12 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pl-0 pr-0 pt-0 pb-0">
        <div className="overflow-x-auto">
          <div className="min-w-[600px] h-[250px] sm:h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 0,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
                barGap={8}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 4"
                  stroke="#eaeaea"
                />
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={15}
                  interval="preserveStartEnd"
                  angle={0}
                  textAnchor="middle"
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  ticks={[0, 100, 200, 300, 400, 500]}
                  tickFormatter={(value) => `${value}`}
                  domain={[0, 500]}
                  width={40}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="returningCustomers"
                  fill="#D7DBEC"
                  radius={[4, 4, 4, 4]}
                  barSize={8}
                />
                <Bar
                  dataKey="newCustomers"
                  fill="#4EA674"
                  radius={[4, 4, 4, 4]}
                  barSize={8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
