import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

interface ConversionRateProps {
  data: {
    percentage: number;
    cart: number;
    checkout: number;
    purchase: number;
  };
}

export function ConversionRate({ data }: ConversionRateProps) {
  const chartData = [
    { name: "Converted", value: data.percentage, fill: "#22c55e" },
    { name: "Remaining", value: 100 - data.percentage, fill: "#F3F4F6" },
  ];

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-base font-bold">Conversion Rate</CardTitle>
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
                <Cell key="converted" fill="#22c55e" />
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
            <span className="text-gray-500">Cart:</span>
            <span className="font-bold">{data.cart}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Checkout:</span>
            <span className="font-bold">{data.checkout}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Purchase:</span>
            <span className="font-bold">{data.purchase}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
