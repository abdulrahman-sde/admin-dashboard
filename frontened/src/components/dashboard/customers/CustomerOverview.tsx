"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGetDetailedDailyMetricsQuery } from "@/lib/store/services/analytics/analyticsApi";

import type {
  CustomCursorProps,
  CustomTooltipProps,
} from "@/types/shared.types";

const chartConfig = {
  customers: {
    label: "Customers",
    color: "#4EA674",
  },
} satisfies ChartConfig;

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
      stroke="#4EA674"
      strokeWidth={1}
      strokeDasharray="5 5"
    />
  );
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const day = data.payload.day;
  const value = data.value;

  return (
    <div className="bg-[#4EA674] text-white px-3 py-1.5 rounded-md text-sm">
      <div className="font-medium">{day}</div>
      <div className="font-semibold">{Number(value).toLocaleString()}</div>
    </div>
  );
};

export default function CustomerOverview() {
  const [timeRange, setTimeRange] = React.useState("this-week");
  const [activeTab, setActiveTab] = React.useState("activeCustomers");

  const { data: analyticsData, isLoading } = useGetDetailedDailyMetricsQuery();

  const metrics = React.useMemo(() => {
    if (!analyticsData) return [];
    return timeRange === "this-week"
      ? analyticsData.data.customerOverview.thisWeek
      : analyticsData.data.customerOverview.lastWeek;
  }, [analyticsData, timeRange]);

  const stats = React.useMemo(() => {
    if (!metrics.length) {
      return {
        activeCustomers: 0,
        repeatCustomers: 0,
        shopVisitor: 0,
        conversionRate: "0%",
      };
    }

    const totalActive = metrics.reduce((sum, m) => sum + m.activeCustomers, 0);
    const totalRepeat = metrics.reduce((sum, m) => sum + m.repeatCustomers, 0);
    const totalVisitors = metrics.reduce((sum, m) => sum + m.shopVisitor, 0);
    // Average conversion rate
    const avgConversion =
      metrics.reduce((sum, m) => sum + m.conversionRate, 0) /
      (metrics.length || 1);

    return {
      activeCustomers: totalActive,
      repeatCustomers: totalRepeat,
      shopVisitor: totalVisitors,
      conversionRate: `${avgConversion.toFixed(1)}%`,
    };
  }, [metrics]);

  if (isLoading) {
    return (
      <Card className="border-[#F1F5F9] shadow-sm h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading metrics...
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-[#F1F5F9] shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row min-h-full items-start sm:items-center justify-between pb-4 gap-4">
        <div>
          <h3>Customer Overview</h3>
        </div>

        <ToggleGroup
          type="single"
          value={timeRange}
          onValueChange={(value) => value && setTimeRange(value)}
          className="bg-muted rounded-lg p-1 w-full sm:w-auto"
        >
          <ToggleGroupItem
            value="this-week"
            className="data-[state=on]:bg-white data-[state=on]:shadow-sm rounded-md px-4 py-1.5 text-sm flex-1 sm:flex-none"
          >
            This week
          </ToggleGroupItem>
          <ToggleGroupItem
            value="last-week"
            className="data-[state=on]:bg-white data-[state=on]:shadow-sm rounded-md px-4 py-1.5 text-sm flex-1 sm:flex-none"
          >
            Last week
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-6">
        {/* Stats Row - Horizontal Scroll on small screens */}
        <div className="flex sm:grid sm:grid-cols-4 gap-6 md:gap-8 mb-8 overflow-x-auto no-scrollbar pb-2 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("activeCustomers")}
            className="space-y-1 text-left transition-opacity hover:opacity-80 shrink-0 sm:shrink"
          >
            <h2 className="text-2xl font-semibold">{stats.activeCustomers}</h2>
            <p className="text-[14px] leading-[18px] font-normal text-muted-foreground whitespace-nowrap">
              Active Customers
            </p>
            {activeTab === "activeCustomers" && (
              <div className="h-0.5 w-[80%] mt-1 bg-primary rounded-full transition-all" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("repeatCustomers")}
            className="space-y-1 text-left transition-opacity hover:opacity-80 shrink-0 sm:shrink"
          >
            <h2 className="text-2xl font-semibold">{stats.repeatCustomers}</h2>
            <p className="text-[14px] leading-[18px] font-normal text-muted-foreground whitespace-nowrap">
              Repeat Customers
            </p>
            {activeTab === "repeatCustomers" && (
              <div className="h-0.5 w-[80%] mt-1 bg-primary rounded-full transition-all" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("shopVisitor")}
            className="space-y-1 text-left transition-opacity hover:opacity-80 shrink-0 sm:shrink"
          >
            <h2 className="text-2xl font-semibold">{stats.shopVisitor}</h2>
            <p className="text-[14px] leading-[18px] font-normal text-muted-foreground whitespace-nowrap">
              Shop Visitor
            </p>
            {activeTab === "shopVisitor" && (
              <div className="h-0.5 w-[80%] mt-1 bg-primary rounded-full transition-all" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("conversionRate")}
            className="space-y-1 text-left transition-opacity hover:opacity-80 shrink-0 sm:shrink"
          >
            <h2 className="text-2xl font-semibold">{stats.conversionRate}</h2>
            <p className="text-[14px] leading-[18px] font-normal text-muted-foreground whitespace-nowrap">
              Conversion Rate
            </p>
            {activeTab === "conversionRate" && (
              <div className="h-0.5 w-[80%] mt-1 bg-primary rounded-full transition-all" />
            )}
          </button>
        </div>

        {/* Chart - Responsive Wrapper */}
        <div className="overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
          <div className="h-[300px] min-w-[500px] md:min-w-0">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                data={metrics}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="fillCustomers"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4EA674" stopOpacity={0.3} />
                    <stop
                      offset="100%"
                      stopColor="#4EA674"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                    return value;
                  }}
                  style={{ fontSize: "12px" }}
                />
                <ChartTooltip
                  cursor={<CustomCursor />}
                  content={<CustomTooltip />}
                />
                <Area
                  type="monotone"
                  dataKey={activeTab}
                  stroke="#4EA674"
                  strokeWidth={2}
                  fill="url(#fillCustomers)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
