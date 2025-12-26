import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { CategoryProduct } from "@/types/categories.types";

type QuickEditProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    id: string | number,
    data: { name: string; price: number; stock: number }
  ) => Promise<void>;
  product: CategoryProduct | null;
  isLoading?: boolean;
};

export default function QuickEditProductDialog({
  open,
  onOpenChange,
  onSave,
  product,
  isLoading = false,
}: QuickEditProductDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price?.toString() || "");
      setStock(product.stock?.toString() || "");
    }
  }, [product]);

  const handleSave = async () => {
    if (product && name.trim() && price && stock) {
      await onSave(product.id, {
        name,
        price: Number(price),
        stock: Number(stock),
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Quick Edit Product
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Product Name *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="border-[#E5E7EB]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price *</Label>
              <Input
                id="edit-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                className="border-[#E5E7EB]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock *</Label>
              <Input
                id="edit-stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                min="0"
                className="border-[#E5E7EB]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#E5E7EB]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || isLoading}
              className="bg-[#4EA674] hover:bg-[#3d8a5e] text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
