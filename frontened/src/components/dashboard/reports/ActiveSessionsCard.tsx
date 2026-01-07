import { ArrowUp } from "lucide-react";
import { useGetActiveSessionsQuery } from "@/lib/store/services/reportsApi";

const ActiveSessionsCard = () => {
  const { data, isLoading } = useGetActiveSessionsQuery(undefined, {
    pollingInterval: 30000,
  });

  return (
    <div className="bg-white p-6 rounded-2xl">
      <h3 className="mb-4 text-base font-semibold text-gray-900">
        Online Sessions
      </h3>

      {isLoading ? (
        <div className="h-20 animate-pulse bg-gray-50 rounded" />
      ) : (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {data?.activeUsers || 0}
            </span>
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
              <ArrowUp className="mr-0.5 h-3 w-3" />
              Active Users
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Users currently active on the site (last 30m)
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveSessionsCard;
