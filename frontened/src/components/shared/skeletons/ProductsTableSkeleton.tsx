import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductsTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="border-b border-[#E5E7EB] [&_td]:py-4">
          <TableCell className="ps-8 w-[10%]">
            <Skeleton className="h-4 w-6" />
          </TableCell>
          <TableCell className="w-[30%]">
            <div className="flex items-center gap-3 justify-center">
              <Skeleton className="size-10 rounded-lg shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell className="text-center w-[20%]">
            <div className="flex justify-center">
              <Skeleton className="h-4 w-24" />
            </div>
          </TableCell>
          <TableCell className="text-center w-[20%]">
            <div className="flex justify-center">
              <Skeleton className="h-4 w-12" />
            </div>
          </TableCell>
          <TableCell className="w-[20%]">
            <div className="flex items-center justify-end gap-2 px-4">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
