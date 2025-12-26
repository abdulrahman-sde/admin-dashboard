import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomersTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="h-16 border-b border-[#E5E7EB]">
          <TableCell className="w-[15%] px-8">
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell className="w-[20%] px-8">
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell className="w-[15%]">
            <div className="flex justify-center">
              <Skeleton className="h-4 w-32" />
            </div>
          </TableCell>
          <TableCell className="w-[15%]">
            <div className="flex justify-center">
              <Skeleton className="h-4 w-12" />
            </div>
          </TableCell>
          <TableCell className="w-[15%]">
            <div className="flex justify-center">
              <Skeleton className="h-4 w-20" />
            </div>
          </TableCell>
          <TableCell className="w-[10%]">
            <div className="flex justify-center gap-2 items-center">
              <Skeleton className="size-2 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </TableCell>
          <TableCell className="w-[10%] pr-8">
            <div className="flex justify-end gap-2">
              <Skeleton className="size-8 rounded" />
              <Skeleton className="size-8 rounded" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
