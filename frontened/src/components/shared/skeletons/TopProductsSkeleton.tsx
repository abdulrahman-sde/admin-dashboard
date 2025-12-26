import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TopProductsSkeleton() {
  return (
    <Card className="shadow-sm border-0 pb-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-20" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
