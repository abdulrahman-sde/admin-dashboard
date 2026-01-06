import { Smartphone, Monitor, Tablet, Laptop } from "lucide-react";
import { useGetDeviceAnalyticsQuery } from "@/lib/store/services/reportsApi";

const VisitsByDevice = () => {
  // We can pass date range if needed, or default to all-time/recent
  const { data, isLoading } = useGetDeviceAnalyticsQuery({});

  if (isLoading)
    return (
      <div className="h-[200px] bg-white rounded-xl p-6 border border-gray-100 animate-pulse" />
    );

  const getIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "desktop":
        return <Laptop className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-base font-semibold text-gray-900">
        Visits by Device
      </h3>

      <div className="space-y-6">
        {data?.devices.map((item) => (
          <div key={item.device} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">{getIcon(item.device)}</span>
              <span className="text-sm font-medium text-gray-700 capitalize">
                {item.device}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {item.percentage}%
            </span>
          </div>
        ))}

        {data?.devices.length === 0 && (
          <div className="text-center text-sm text-gray-500">
            No device data
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitsByDevice;
