import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export function AddNewProductSkeleton() {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="flex flex-row items-center justify-between ">
        <h3 className="font-semibold">Add New Product</h3>
        <button className="text-primary text-sm hover:underline flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories Section */}
        <div>
          <p className="text-[13px] text-muted-foreground mb-3">Categories</p>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full flex items-center gap-3 p-3 rounded-lg"
              >
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div>
          <p className="text-[13px] text-muted-foreground mb-3">Product</p>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
