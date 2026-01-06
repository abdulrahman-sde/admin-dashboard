import ReactCountryFlag from "react-country-flag";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, MoreVertical } from "lucide-react";
import { useGetRealTimeStatsQuery } from "@/lib/store/services/analytics/analyticsApi";

// Helper to get country code from name (basic mapping)
const getCountryCode = (name: string): string => {
  const mapping: Record<string, string> = {
    US: "US",
    USA: "US",
    Brazil: "BR",
    "United States": "US",
    Australia: "AU",
    India: "IN",
    Canada: "CA",
    UK: "GB",
    "United Kingdom": "GB",
    Germany: "DE",
    France: "FR",
    China: "CN",
    Japan: "JP",
  };
  return mapping[name] || "US";
};

interface CountryGrowthItem {
  country: string;
  sales: number;
  change: number;
}

interface CountryWiseSalesProps {
  data: CountryGrowthItem[];
  isLoading?: boolean;
}

export default function CountryWiseSales({
  data,
  isLoading,
}: CountryWiseSalesProps) {
  // Real-time polling
  const { data: realTimeData } = useGetRealTimeStatsQuery(undefined, {
    pollingInterval: 5000,
  });

  const activeUsers = realTimeData?.data?.activeUsers || 0;
  const usersPerMinute = realTimeData?.data?.usersPerMinute || [];

  if (isLoading) {
    return (
      <Card className="shadow-sm border-0 h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading geographic data...
        </div>
      </Card>
    );
  }

  // Calculate max values for scaling
  const maxSales = data.length > 0 ? Math.max(...data.map((d) => d.sales)) : 1;
  const maxUsersPerMin =
    usersPerMinute.length > 0 ? Math.max(...usersPerMinute) : 1;

  const formatValue = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return val.toString();
  };

  return (
    <Card className="shadow-sm border-0 overflow-hidden">
      <CardContent className="p-5">
        {/* Real-time Users Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-tertiary text-[14px] font-medium">
              Users in last 30 minutes
            </span>
            <MoreVertical className="h-5 w-5 text-neutral-300 cursor-pointer" />
          </div>
          <h2 className="text-[38px] font-bold text-[#0D0E10] tracking-tight leading-none mb-3">
            {formatValue(activeUsers)}
          </h2>

          <p className="text-[#707D94] text-[14px] font-medium mb-2.5">
            Users per minute
          </p>
          <div className="flex items-end gap-1 h-[50px] w-full">
            {usersPerMinute.length > 0 ? (
              usersPerMinute.map((count, i) => (
                <div
                  key={i}
                  className="bg-primary opacity-80 rounded-[2.5px] flex-1" // Changed w-full to flex-1 for even distribution
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
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-table-header text-[17px] tracking-tight">
              Sales by Country
            </h3>
            <span className="font-bold text-table-header text-[17px] tracking-tight">
              Sales
            </span>
          </div>

          {data.slice(0, 5).map((item, index) => {
            const isPositive = item.change >= 0;
            const progress = (item.sales / maxSales) * 100;
            const formattedSales = formatValue(item.sales);
            const countryCode = getCountryCode(item.country);

            return (
              <div key={index} className="relative">
                <div className="flex items-center gap-3">
                  {/* Flag Container */}
                  <div className="size-10 rounded-full overflow-hidden shrink-0 border-0">
                    <ReactCountryFlag
                      countryCode={countryCode}
                      svg
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Info + Progress Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-baseline gap-2">
                        <p className="text-[17px] font-bold text-[#101928] leading-none">
                          {formattedSales}
                        </p>
                        <p className="text-[13px] text-[#8C94A3] font-medium uppercase">
                          {countryCode}
                        </p>
                      </div>

                      {/* Trend */}
                      <div
                        className={`flex items-center gap-0.5 text-[14px] font-bold shrink-0 ${
                          isPositive ? "text-primary" : "text-destructive"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5" />
                        )}
                        {Math.abs(item.change).toFixed(1)}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#F5F7FA] rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-tertiary h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="w-full text-tertiary border-tertiary rounded-full h-11 text-[15px] font-bold mt-6 hover:bg-tertiary hover:text-white transition-all duration-200 border bg-transparent"
        >
          View Insight
        </Button>
      </CardContent>
    </Card>
  );
}
