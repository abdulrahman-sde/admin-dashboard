import { Smartphone, Laptop, Tablet, GripHorizontal } from "lucide-react";

interface VisitsByDeviceProps {
  data: Array<{
    device: string;
    percentage: number;
  }>;
}

export function VisitsByDevice({ data }: VisitsByDeviceProps) {
  const getIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4.5 w-4.5 text-[#5D6679]" />;
      case "laptop":
        return <Laptop className="h-4.5 w-4.5 text-[#5D6679]" />;
      case "tablet":
        return <Tablet className="h-4.5 w-4.5 text-[#5D6679]" />;
      default:
        return <GripHorizontal className="h-4.5 w-4.5 text-[#5D6679]" />;
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      <h2 className="text-[17px] font-bold text-gray-900 mb-8">
        Visits by Device
      </h2>
      <div className="space-y-6">
        {data.map((item) => (
          <div key={item.device} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="shrink-0">{getIcon(item.device)}</div>
              <span className="text-[14px] font-medium text-[#8E92BC]">
                {item.device}
              </span>
            </div>
            <span className="text-[14px] font-bold text-gray-900">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
