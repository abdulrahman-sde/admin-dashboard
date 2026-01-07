import { useMemo } from "react";
import { useGetRealTimeStatsQuery } from "@/lib/store/services/analytics/analyticsApi";
import { mockCountrySalesData } from "@/constants/reportsData";
import type { CountryGrowthItem } from "@/types/analytics.types";

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
  if (val >= 1000000) return `${Math.floor(val / 1000000)}M`;
  if (val >= 1000) return `${Math.floor(val / 1000)}k`;
  return Math.floor(val).toString();
};

export function useCountryWiseSales(data: CountryGrowthItem[] = []) {
  const { data: realTimeData, isLoading: isRealTimeLoading } =
    useGetRealTimeStatsQuery(undefined, {
      pollingInterval: 5000,
    });

  const activeUsers = realTimeData?.data?.activeUsers || 0;
  const usersPerMinute = realTimeData?.data?.usersPerMinute || [];

  const displayData = useMemo(() => {
    return data.length > 0 ? data : mockCountrySalesData;
  }, [data]);

  const maxSales = useMemo(() => {
    return displayData.length > 0
      ? Math.max(...displayData.map((d) => d.sales))
      : 1;
  }, [displayData]);

  const maxUsersPerMin = useMemo(() => {
    return usersPerMinute.length > 0 ? Math.max(...usersPerMinute) : 1;
  }, [usersPerMinute]);

  const processedCountries = useMemo(() => {
    return displayData.slice(0, 5).map((item) => ({
      ...item,
      isPositive: item.change >= 0,
      progress: (item.sales / maxSales) * 100,
      formattedSales: formatValue(item.sales),
      countryCode: getCountryCode(item.country),
    }));
  }, [displayData, maxSales]);

  return {
    activeUsers: formatValue(activeUsers),
    usersPerMinute,
    processedCountries,
    maxUsersPerMin,
    isLoading: isRealTimeLoading,
  };
}
