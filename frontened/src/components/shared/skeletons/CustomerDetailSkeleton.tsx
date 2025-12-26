import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomerDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back Button Skeleton */}
      <Skeleton className="h-10 w-40 mb-4" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information Card Skeleton */}
          <Card className="border-[#D1D5DB]">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-5 w-5" />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-[100px] w-full rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Orders Card Skeleton */}
          <Card className="border-[#D1D5DB]">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Table Header Skeleton */}
                <div className="grid grid-cols-4 gap-4 py-2 bg-muted/50 px-4 rounded-t-md">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                {/* Table Rows Skeleton */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 gap-4 py-4 px-4 border-b border-gray-100"
                  >
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Overview and Tags */}
        <div className="space-y-6">
          {/* Overview Card Skeleton */}
          <Card className="border-[#D1D5DB]">
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-12" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>

          {/* Tags Card Skeleton */}
          <Card className="border-[#D1D5DB]">
            <CardHeader>
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
