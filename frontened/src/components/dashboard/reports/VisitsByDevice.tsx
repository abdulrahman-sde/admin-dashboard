import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Laptop, Tablet, Monitor } from "lucide-react";

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
        return <Smartphone className="h-4 w-4 text-gray-500" />;
      case "laptop":
        return <Laptop className="h-4 w-4 text-gray-500" />;
      case "tablet":
        return <Tablet className="h-4 w-4 text-gray-500" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Visits by Device</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((item) => (
          <div key={item.device} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-md">
                {getIcon(item.device)}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {item.device}
              </span>
            </div>
            <span className="font-bold text-gray-900">{item.percentage}%</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
