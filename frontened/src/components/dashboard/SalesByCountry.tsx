import ReactCountryFlag from "react-country-flag";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import bgImage from "@/assets/images/salesByCountry.svg";

interface CountrySalesItem {
  country: string;
  sales: number;
  change: number;
}

interface SalesByCountryProps {
  data: CountrySalesItem[];
  className?: string;
}

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

const formatValue = (val: number) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
  return val.toString();
};

export function SalesByCountry({ data, className }: SalesByCountryProps) {
  const maxSales = data.length > 0 ? Math.max(...data.map((d) => d.sales)) : 1;

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden bg-white p-6",
        className
      )}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-[#151D48]">Sales by Country</h3>
        <span className="text-sm font-semibold text-[#151D48] opacity-60">
          Sales
        </span>
      </div>

      <div className="space-y-6">
        {data.slice(0, 6).map((item, index) => {
          const isPositive = item.change >= 0;
          const countryCode = getCountryCode(item.country);
          const progress = (item.sales / maxSales) * 100;

          return (
            <div key={index} className="flex items-center gap-4">
              {/* Flag */}
              <div className="size-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
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

              {/* Value & Name */}
              <div className="w-20 shrink-0">
                <p className="text-[15px] font-bold text-[#151D48] leading-tight">
                  {formatValue(item.sales)}
                </p>
                <p className="text-[13px] text-[#737791] font-medium">
                  {item.country === "United States" ? "US" : item.country}
                </p>
              </div>

              {/* Progress Bar Container */}
              <div className="flex-1 flex items-center gap-4">
                <div className="flex-1 h-1.5 bg-[#EFF1F3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6467F2] rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Change */}
                <div
                  className={cn(
                    "flex items-center gap-1 text-[13px] font-bold min-w-[60px] justify-end",
                    isPositive ? "text-[#4EA674]" : "text-[#EF4343]"
                  )}
                >
                  {isPositive ? (
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
  );
}
