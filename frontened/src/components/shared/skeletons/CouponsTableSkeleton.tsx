import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function CouponsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="h-20 border-b border-gray-50">
          <TableCell className="pl-6 pr-0 w-12">
            <Skeleton className="h-5 w-5 rounded" />
          </TableCell>
          <TableCell className="w-[40%] pl-2">
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell className="text-center w-[15%]">
            <div className="flex flex-col items-center">
              <Skeleton className="h-4 w-12" />
            </div>
          </TableCell>
          <TableCell className="text-center w-[15%]">
            <div className="flex justify-center">
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          </TableCell>
          <TableCell className="w-[25%]">
            <Skeleton className="h-4 w-40" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
