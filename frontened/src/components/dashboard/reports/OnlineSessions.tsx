import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";

interface OnlineSessionsProps {
  data: {
    value: number;
    isPositive: boolean;
  };
}

export function OnlineSessions({ data }: OnlineSessionsProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Online Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{data.value}</span>
            <div className="flex items-center text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUp className="h-3 w-3 mr-1" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Active Users</p>
        </div>
      </CardContent>
    </Card>
  );
}
