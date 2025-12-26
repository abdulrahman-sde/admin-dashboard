import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="space-y-4">
        <CardTitle className="text-base font-bold">
          Average Order Value
        </CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-500 mr-2">This Month</span>
            <span className="font-bold">${data.thisMonth.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500 mr-2">Previous Month</span>
            <span className="font-bold text-gray-500">
              ${data.prevMonth.toFixed(2)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trend}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip cursor={{ stroke: "#e5e7eb" }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
