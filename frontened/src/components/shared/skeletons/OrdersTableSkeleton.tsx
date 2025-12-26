import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="border-b border-[#E5E7EB] [&_td]:py-4">
          <TableCell className="px-6 w-[5%]">
            <Skeleton className="h-4 w-6" />
          </TableCell>
          <TableCell className="px-4 w-[15%]">
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell className="w-[25%]">
            <div className="ps-5 flex items-center gap-2">
              <Skeleton className="size-12 rounded shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell className="w-[15%]">
            <div className="flex justify-center">
              <Skeleton className="h-4 w-24" />
            </div>
          </TableCell>
          <TableCell className="text-center w-[10%]">
            <div className="flex justify-center">
              <Skeleton className="h-4 w-12" />
            </div>
          </TableCell>
          <TableCell className="w-[15%]">
            <div className="flex justify-center">
              <Skeleton className="h-4 w-20" />
            </div>
          </TableCell>
          <TableCell className="w-[15%]">
            <div className="flex justify-center pr-6">
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
