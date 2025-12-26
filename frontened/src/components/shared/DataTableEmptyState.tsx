import { TableRow, TableCell } from "@/components/ui/table";

interface DataTableEmptyStateProps {
  colSpan: number;
  message?: string;
}

export function DataTableEmptyState({
  colSpan,
  message = "No records found",
}: DataTableEmptyStateProps) {
  return (
    <TableRow className="hover:bg-transparent border-none">
      <TableCell
        colSpan={colSpan}
        className="text-center py-20 text-muted-foreground italic h-64"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-lg font-medium not-italic text-gray-400">
            {message}
          </div>
          <p className="text-sm text-gray-400">
            There are no records to display at the moment.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}
