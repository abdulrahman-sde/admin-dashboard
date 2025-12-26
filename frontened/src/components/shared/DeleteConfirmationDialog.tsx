import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

type DeleteConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  isLoading?: boolean;
};

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-[#6B7280]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-[#E5E7EB]"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await onConfirm();
              onOpenChange(false);
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
