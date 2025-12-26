"use client";

import ReactCountryFlag from "react-country-flag";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import type { CountrySalesProps } from "@/types";

export default function CountryWiseSales({ data }: CountrySalesProps) {
  const chartData = data.usersPerMinute.map((value, index) => ({
    index,
    value,
  }));

  const chartConfig = {
    value: {
      color: "#4EA674",
    },
  };

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="flex-row items-start justify-between ">
        <div className="space-y-1">
          <p className="text-[15px] text-tertiary  font-normal ">
            Users in last 30 minutes
          </p>
          <h1 className="text-3xl font-semibold">{data.totalUsers}</h1>
        </div>
      </CardHeader>

      <CardContent>
        {/* Mini Bar Chart */}
        <div className="-mt-2">
          <p className="text-[15px] leading-[18px] font-normal text-muted-foreground mb-3">
            Users per minute
          </p>
          <ChartContainer config={chartConfig} className="h-16 w-full">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <Bar
                dataKey="value"
                fill="#4EA674"
                radius={[2, 2, 2, 2]}
                maxBarSize={11}
              />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Countries Section */}
        <div className="space-y-4 mt-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Sales by Country</h3>
            <h3 className="font-semibold">Sales</h3>
          </div>

          {/* Country List */}
          <div className="space-y-2">
            {data.countries.map((country, index) => (
              <div key={index}>
                <div className="grid grid-cols-6 items-center gap-6">
                  <div className="flex items-center gap-3 col-span-2">
                    <ReactCountryFlag
                      countryCode={country.countryCode}
                      svg
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium">{country.sales}</p>
                      <p className="text-[13px] text-muted-foreground">
                        {country.name}
                      </p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2 col-span-4">
                    <div
                      className="bg-tertiary h-2 rounded-full transition-all"
                      style={{ width: `${country.progress}%` }}
                    />
                  </div>
                </div>
                <div
                  className={`flex relative justify-self-end bottom-14 items-center gap-1 text-sm font-medium ${
                    country.isPositive ? "text-[#4EA674]" : "text-destructive"
                  }`}
                >
                  {country.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {country.change}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Insight Button */}
        <Button
          variant="outline"
          className="w-full text-tertiary border-tertiary rounded-full mb-1.5"
        >
          View Insight
        </Button>
      </CardContent>
    </Card>
  );
}
