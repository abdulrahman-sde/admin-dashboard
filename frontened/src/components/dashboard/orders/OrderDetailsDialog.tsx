import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { OrderListItem } from "@/types/orders.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: OrderListItem | null;
};

export default function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
}: Props) {
  if (!order) return null;

  const customerName = `${order.customer?.firstName ?? ""} ${
    order.customer?.lastName ?? ""
  }`.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pr-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <DialogTitle className="text-lg font-semibold">
                  Order
                </DialogTitle>
                <span className="text-sm text-muted-foreground">
                  {order.orderNumber}
                </span>
              </div>
              <DialogDescription className="text-sm text-muted-foreground">
                {customerName || order.customer?.email}
              </DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-semibold text-lg">
                ${order.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Items</h4>
          <div className="space-y-3">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white p-3 rounded-lg border border-[#F1F5F9]"
                >
                  <div className="w-12 h-12 bg-[#f8fafc] rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={
                        item.productImage ||
                        "https://via.placeholder.com/48?text=No+Img"
                      }
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/48?text=No+Img";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground italic">
                No items
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E5E7EB]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
