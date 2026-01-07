import { useGetDeviceAnalyticsQuery } from "@/lib/store/services/reportsApi";

export function useVisitsByDevice() {
  const { data, isLoading } = useGetDeviceAnalyticsQuery({});

  return {
    devices: data?.devices || [],
    isLoading,
  };
}
