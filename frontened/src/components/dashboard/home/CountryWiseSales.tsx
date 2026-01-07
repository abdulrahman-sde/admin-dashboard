import ReactCountryFlag from "react-country-flag";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, MoreVertical } from "lucide-react";
import { useCountryWiseSales } from "@/hooks/dashboard/useCountryWiseSales";
import type { CountryGrowthItem } from "@/types/analytics.types";
import { cn } from "@/lib/utils";
import bgImage from "@/assets/images/salesByCountry.svg";

interface CountryWiseSalesProps {
  data: CountryGrowthItem[];
  isLoading?: boolean;
}

export default function CountryWiseSales({
  data,
  isLoading: isExternalLoading,
}: CountryWiseSalesProps) {
  const {
    activeUsers,
    usersPerMinute,
    processedCountries,
    maxUsersPerMin,
    isLoading: isRealTimeLoading,
  } = useCountryWiseSales(data);

  if (isExternalLoading || isRealTimeLoading) {
    return (
      <Card className="shadow-sm border-0 h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading geographic data...
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 overflow-hidden">
      <CardContent className="px-5">
        {/* Real-time Users Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-tertiary text-[14px] font-medium">
              Users in last 30 minutes
            </span>
            <MoreVertical className="h-5 w-5 text-neutral-300 cursor-pointer" />
          </div>
          <h2 className="text-[38px] font-bold text-[#0D0E10] tracking-tight leading-none mb-3">
            {activeUsers}
          </h2>

          <p className="text-[#707D94] text-[14px] font-medium mb-2.5">
            Users per minute
          </p>
          <div className="flex items-end gap-1 h-[50px] w-full">
            {usersPerMinute.length > 0 ? (
              usersPerMinute.map((count, i) => (
                <div
                  key={i}
                  className="bg-primary opacity-80 rounded-[2.5px] flex-1"
                  style={{
                    height: `${Math.max(
                      8,
                      (count / (maxUsersPerMin || 1)) * 100
                    )}%`,
                  }}
                />
              ))
            ) : (
              <div className="w-full flex items-center justify-center text-xs text-gray-300 italic h-full">
                Waiting for activity...
              </div>
            )}
          </div>
        </div>

        {/* Country-wise Sales List */}
        <div
          className="mt-8 relative rounded-xl border border-gray-50 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="px-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#151D48] text-[17px]">
                Sales by Country
              </h3>
              <span className="font-semibold text-[#151D48] opacity-50 text-[13px]">
                Sales
              </span>
            </div>

            <div className="space-y-5">
              {processedCountries.map((item, index) => {
                return (
                  <div key={index} className="flex items-center gap-4">
                    {/* Flag Container */}
                    <div className="size-9 rounded-full overflow-hidden shrink-0 shadow-sm border border-gray-100">
                      <ReactCountryFlag
                        countryCode={item.countryCode}
                        svg
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* Info Section */}
                    <div className="w-14 shrink-0">
                      <p className="text-[15px] font-bold text-[#151D48] leading-tight">
                        {item.formattedSales}
                      </p>
                      <p className="text-[12px] text-[#737791] font-medium uppercase opacity-70">
                        {item.country === "United States"
                          ? "US"
                          : item.countryCode}
                      </p>
                    </div>

                    {/* Progress Bar & Trend */}
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 bg-[#EFF1F3] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#5C60F5] h-full rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>

                      {/* Trend */}
                      <div
                        className={cn(
                          "flex items-center gap-0.5 text-[13px] font-bold min-w-[50px] justify-end",
                          item.isPositive ? "text-[#4EA674]" : "text-[#EF4343]"
                        )}
                      >
                        {item.isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{Math.abs(item.change).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full text-tertiary border-tertiary rounded-full  text-[15px] font-bold mt-6 hover:bg-tertiary hover:text-white transition-all duration-200 border bg-transparent"
        >
          View Insight
        </Button>
      </CardContent>
    </Card>
  );
}
