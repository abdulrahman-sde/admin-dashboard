import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCardSkeleton() {
  return (
    <Card className="rounded-lg border border-[#E5E7EB] h-20 animate-pulse bg-white">
      <CardContent className="p-3 h-full">
        <div className="flex items-center gap-4 h-full">
          <Skeleton className="h-14 w-14 rounded-lg shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
