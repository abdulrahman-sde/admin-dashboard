"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { mockWeeklyReportData } from "@/constants/mockDashboardData";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#4EA674",
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
  // Calculate the bottom of the chart area (where x-axis is)
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

export default function WeeklyReport() {
  const [timeRange, setTimeRange] = React.useState("this-week");
  const [activeTab, setActiveTab] = React.useState("customers");

  const data = mockWeeklyReportData;
  const weekData =
    timeRange === "this-week"
      ? data.thisWeek.chartData
      : data.lastWeek.chartData;
  const chartData = weekData[activeTab as keyof typeof weekData];
  const stats =
    timeRange === "this-week" ? data.thisWeek.stats : data.lastWeek.stats;

  return (
    <Card className="col-span-2 border-[#F1F5F9] shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row min-h-full items-start sm:items-center justify-between pb-4 gap-4">
        <div>
          <h3>Report for this week</h3>
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
      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          <button
            onClick={() => setActiveTab("customers")}
            className="space-y-1 text-left transition-opacity hover:opacity-80"
          >
            <h2 className="">{stats.customers}</h2>
            <p className="text-[14px] leading-[18px] font-normal text-muted-foreground">
              Customers
            </p>
            {activeTab === "customers" && (
              <div className="h-0.5 w-[80%] mt-1 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("totalProducts")}
            className="space-y-1 text-left transition-opacity hover:opacity-80"
          >
            <h2 className="text-2xl font-semibold">{stats.totalProducts}</h2>
            <p className="text-[14px] leading-[18px] font-normal text-muted-foreground">
              Total Products
            </p>
            {activeTab === "totalProducts" && (
              <div className="h-0.5 w-[80%] mt-1 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("stockProducts")}
            className="space-y-1 text-left transition-opacity hover:opacity-80"
          >
            <h2 className="text-2xl font-semibold">{stats.stockProducts}</h2>
            <p className="text-[14px] leading-[18px] font-normal text-muted-foreground">
              Stock Products
            </p>
            {activeTab === "stockProducts" && (
              <div className="h-0.5 w-[80%] mt-1 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("outOfStock")}
            className="space-y-1 text-left transition-opacity hover:opacity-80"
          >
            <h2 className="text-2xl font-semibold">{stats.outOfStock}</h2>
            <p className="text-[14px] leading-[18px] font-normal text-muted-foreground">
              Out of Stock
            </p>
            {activeTab === "outOfStock" && (
              <div className="h-0.5 w-[80%] mt-1 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("revenue")}
            className="space-y-1 text-left transition-opacity hover:opacity-80"
          >
            <h2 className="text-2xl font-semibold">{stats.revenue}</h2>
            <p className="text-[14px] leading-[18px] font-normal text-muted-foreground">
              Revenue
            </p>
            {activeTab === "revenue" && (
              <div className="h-0.5 w-[80%] mt-1 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="h-[300px] w-full -ms-4 md:ms-0"
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 0,
              right: 0,
              top: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4EA6744D" stopOpacity={1} />
                <stop offset="100%" stopColor="#4EA67400" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fill: "#02333780",
                fontSize: 12,
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fill: "#02333780",
                fontSize: 12,
              }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <ChartTooltip
              cursor={<CustomCursor />}
              wrapperStyle={{ outline: "none" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#C1E6BA] text-black px-[21.5px] py-2 rounded-md shadow-lg border-none text-center">
                      <p className="font-semibold text-sm">
                        {payload[0].payload.day}
                      </p>
                      <p className="text-xs">
                        {payload[0].value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              dataKey="value"
              type="monotone"
              fill="url(#fillRevenue)"
              fillOpacity={1}
              stroke="#4EA674"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
