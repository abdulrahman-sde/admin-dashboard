import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useWeeklyReport } from "@/hooks/dashboard/useWeeklyReport";

const chartConfig = {
  active: {
    label: "Value",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface CustomCursorProps {
  points?: { x: number; y: number }[];
  height?: number;
  offset?: { top: number };
}

const CustomCursor = (props: CustomCursorProps) => {
  const { points, height, offset } = props;
  if (!points || points.length === 0) return null;

  const { x, y } = points[0];
  const bottom = (offset?.top || 0) + (height || 0);

  return (
    <line
      x1={x}
      y1={y}
      x2={x}
      y2={bottom}
      stroke="var(--primary)"
      strokeWidth={0.7}
      strokeDasharray="4 4"
      opacity={0.4}
    />
  );
};

export default function WeeklyReport() {
  const {
    timeRange,
    setTimeRange,
    activeTab,
    setActiveTab,
    metrics,
    stats,
    isLoading,
  } = useWeeklyReport();

  if (isLoading) {
    return (
      <Card className="col-span-2 border-[#F1F5F9] shadow-sm h-[480px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading report...
        </div>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 border-[#F1F5F9] shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4 px-6 pt-6">
        <div>
          <h3 className="text-[18px] font-bold text-[#0D1F3C]">
            Report for this week
          </h3>
        </div>

        <ToggleGroup
          type="single"
          value={timeRange}
          onValueChange={(value) => value && setTimeRange(value)}
          className="bg-[#F5F7FA] rounded-lg p-1"
        >
          <ToggleGroupItem
            value="this-week"
            className="data-[state=on]:bg-white data-[state=on]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium"
          >
            This week
          </ToggleGroupItem>
          <ToggleGroupItem
            value="last-week"
            className="data-[state=on]:bg-white data-[state=on]:shadow-sm rounded-md px-4 py-1.5 text-sm font-medium"
          >
            Last week
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="flex overflow-x-auto no-scrollbar md:grid md:grid-cols-5 gap-6 mb-8 mt-2 pb-2">
          {(
            [
              "customers",
              "totalProducts",
              "stockProducts",
              "outOfStock",
              "revenue",
            ] as const
          ).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex-none md:flex-auto space-y-1 text-left transition-opacity hover:opacity-80 min-w-[120px]"
            >
              <h2 className="text-[24px] font-bold text-[#0D1F3C]">
                {key === "revenue" ? "" : ""} {stats[key]}
              </h2>
              <p className="text-[14px] font-medium text-[#707D94] whitespace-nowrap capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </p>
              {activeTab === key && (
                <div className="h-0.5 w-[80%] mt-1 bg-primary rounded-full transition-all duration-300" />
              )}
            </button>
          ))}
        </div>

        <div className="h-[300px] w-full mt-4">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              data={metrics}
              margin={{ left: -20, right: 0, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="0"
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#707D94", fontSize: 12 }}
                tickMargin={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#707D94", fontSize: 12 }}
                tickFormatter={(v) =>
                  v >= 1000 ? `${Math.ceil(v / 1000)}k` : v
                }
              />
              <ChartTooltip
                cursor={<CustomCursor />}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-primary text-white px-3 py-1.5 rounded-md shadow-lg border-none text-center">
                        <p className="font-semibold text-xs">
                          {payload[0].payload.day}
                        </p>
                        <p className="text-[11px]">
                          {Number(payload[0].value).toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={activeTab}
                stroke="var(--primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
