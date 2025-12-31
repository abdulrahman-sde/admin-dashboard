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
    { name: "Converted", value: data.percentage },
    { name: "Remaining", value: 100 - data.percentage },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] h-full flex flex-col">
      <h2 className="text-[17px] font-bold text-gray-900 mb-6">
        Conversion Rate
      </h2>

      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="h-[180px] min-w-[200px] w-full relative mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
                paddingAngle={0}
              >
                <Cell fill="#4EA674" />
                <Cell fill="#F1F3F9" />
                <Label
                  value={`${data.percentage}%`}
                  position="center"
                  className="text-2xl font-bold fill-gray-900"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-[#8E92BC]">Cart:</span>
          <span className="text-gray-900 font-bold">{data.cart}%</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-[#8E92BC]">Checkout:</span>
          <span className="text-gray-900 font-bold">{data.checkout}%</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-[#8E92BC]">Purchase:</span>
          <span className="text-gray-900 font-bold">{data.purchase}%</span>
        </div>
      </div>
    </div>
  );
}
