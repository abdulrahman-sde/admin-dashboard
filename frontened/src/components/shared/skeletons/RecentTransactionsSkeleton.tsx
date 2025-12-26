import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentTransactionsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index} className="h-11">
          <TableCell className="w-16">
            <Skeleton className="h-4 w-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-4 w-16 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
