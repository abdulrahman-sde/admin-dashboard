import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AvgOrderValueProps {
  data: {
    thisMonth: number;
    prevMonth: number;
    trend: Array<{ time: string; value: number }>;
  };
}

export function AvgOrderValue({ data }: AvgOrderValueProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] h-full flex flex-col">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-[17px] font-bold text-gray-900">
          Average Order Value
        </h2>
        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#8E92BC] font-medium">
              This Month
            </span>
            <span className="text-[14px] font-bold text-gray-900">
              ${data.thisMonth.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#8E92BC] font-medium">
              Previous Month
            </span>
            <span className="text-[14px] font-bold text-gray-900">
              ${data.prevMonth.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="h-full min-h-[180px] min-w-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.trend}
              margin={{ top: 0, right: 0, left: -20, bottom: 20 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#F1F3F9"
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8E92BC", fontSize: 12 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8E92BC", fontSize: 12 }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4EA674"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
