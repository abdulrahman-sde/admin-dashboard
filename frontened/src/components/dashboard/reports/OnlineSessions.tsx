import { ArrowUp } from "lucide-react";

interface OnlineSessionsProps {
  data: {
    value: number;
    isPositive: boolean;
  };
}

export function OnlineSessions({ data }: OnlineSessionsProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      <h2 className="text-[17px] font-bold text-gray-900 mb-6">
        Online Sessions
      </h2>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[28px] font-bold text-gray-900 leading-tight">
            {data.value}
          </span>
          <div className="flex items-center justify-center p-0.5">
            <ArrowUp className="h-5 w-5 text-[#4EA674] stroke-[3px]" />
          </div>
        </div>
        <p className="text-[13px] text-[#8E92BC] font-medium leading-tight">
          Active Users
        </p>
      </div>
    </div>
  );
}
