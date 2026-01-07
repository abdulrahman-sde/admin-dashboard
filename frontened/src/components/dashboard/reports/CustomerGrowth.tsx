import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import type { CustomerGrowthProps } from "@/types";

export function CustomerGrowth({ data }: CustomerGrowthProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-[17px] font-bold text-gray-900">
            Customer Growth
          </h2>
          <div className="flex items-center gap-5 ">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-sm bg-[#D7DBEC]" />
              <span className="text-[13px] text-[#8E92BC] font-medium">
                Returning customers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-sm bg-[#4EA674]" />
              <span className="text-[13px] text-[#8E92BC] font-medium">
                New customers
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="h-[350px] min-w-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 0, right: 0, left: 10, bottom: 20 }}
              barGap={6}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#F1F3F9"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8E92BC", fontSize: 12 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8E92BC", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#F8F9FB" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="returningCustomers"
                fill="#D7DBEC"
                radius={[2, 2, 0, 0]}
                barSize={6}
              />
              <Bar
                dataKey="newCustomers"
                fill="#4EA674"
                radius={[2, 2, 0, 0]}
                barSize={6}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
