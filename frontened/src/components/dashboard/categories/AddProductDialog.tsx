import { useAddProductDialog } from "@/hooks/products/useAddProductDialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

import type { QuickAddProductInput } from "@/types/categories.types";

type AddProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: QuickAddProductInput) => Promise<void>;
  isLoading?: boolean;
};

import { Loader2 } from "lucide-react";

export default function AddProductDialog({
  open,
  onOpenChange,
  onAdd,
  isLoading = false,
}: AddProductDialogProps) {
  const { state, setters, handlers } = useAddProductDialog({
    onAdd,
    onOpenChange,
  });

  const { productName, price, stock, description, imagePreview } = state;
  const { setProductName, setPrice, setStock, setDescription } = setters;
  const {
    handleImageChange,
    handleAdd,
    handleDragOver,
    handleDrop,
    handleClearImage,
  } = handlers;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add Product
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="border-none bg-[#F9FAFB] focus:ring-0"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                className="border-none bg-[#F9FAFB] focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                min="0"
                className="border-none bg-[#F9FAFB] focus:ring-0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
              className="border-none bg-[#F9FAFB] focus:ring-0"
            />
          </div>
          <div className="space-y-2">
            <Label>Product Image (Optional)</Label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImageChange(e);
                  e.target.value = "";
                }}
                className="hidden"
                id="productImageUpload"
              />
              <label
                htmlFor="productImageUpload"
                className="border-2 border-dashed border-[#F9FAFB] rounded-lg p-8 text-center hover:border-[#4EA674] transition-colors cursor-pointer flex flex-col items-center justify-center min-h-40 w-full bg-[#F9FAFB]/50"
              >
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute -top-2 -right-2 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/80 shadow-md z-20 transition-transform active:scale-90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-[#4EA674] font-medium px-4 py-2 rounded-md bg-[#4EA674]/5 border border-[#4EA674]/10">
                      Add File
                    </span>
                    <p className="text-sm text-[#6B7280] mt-3">
                      Or drag and drop files
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-none bg-[#F9FAFB] hover:bg-[#EDF1FD]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!productName.trim() || !price || !stock || isLoading}
              className="bg-[#4EA674] hover:bg-[#3d8a5e] text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
