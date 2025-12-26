interface EmptyStateProps {
  message?: string;
  className?: string;
}

export function EmptyState({
  message = "No records found",
  className = "py-20",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 text-center text-muted-foreground italic ${className}`}
    >
      <div className="text-lg font-medium not-italic text-gray-400">
        {message}
      </div>
      <p className="text-sm text-gray-400 w-full">
        There are no records to display at the moment.
      </p>
    </div>
  );
}
