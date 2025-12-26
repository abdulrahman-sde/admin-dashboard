import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

interface SalesGoalProps {
  data: {
    percentage: number;
    soldFor: number;
    monthGoal: number;
    left: number;
  };
}

export function SalesGoal({ data }: SalesGoalProps) {
  const chartData = [
    { name: "Sold", value: data.percentage, fill: "#FFD700" }, // Gold color as per image (yellowish)
    { name: "Remaining", value: 100 - data.percentage, fill: "#F3F4F6" },
  ];

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-base font-bold">Sales Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell key="sold" fill="#FACC15" />
                <Cell key="remaining" fill="#F3F4F6" />
                <Label
                  value={`${data.percentage}%`}
                  position="center"
                  className="text-2xl font-bold fill-gray-900"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sold for:</span>
            <span className="font-bold">${data.soldFor.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Month goal:</span>
            <span className="font-bold">
              ${data.monthGoal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Left:</span>
            <span className="font-bold">${data.left.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
