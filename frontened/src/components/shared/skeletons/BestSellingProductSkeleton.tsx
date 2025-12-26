import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BestSellingProductSkeleton() {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-4 px-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 py-2"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
