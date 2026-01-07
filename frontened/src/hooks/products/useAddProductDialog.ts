import { useState } from "react";
import type { QuickAddProductInput } from "@/types/categories.types";

interface UseAddProductDialogProps {
  onAdd: (product: QuickAddProductInput) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

export function useAddProductDialog({
  onAdd,
  onOpenChange,
}: UseAddProductDialogProps) {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const resetForm = () => {
    setProductName("");
    setPrice("");
    setStock("");
    setDescription("");
    setImagePreview("");
    setImageFile(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    if (productName.trim() && price && stock) {
      await onAdd({
        name: productName,
        image: imageFile,
        price: Number(price),
        stock: Number(stock),
        description,
      });

      resetForm();
      onOpenChange(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImagePreview("");
    setImageFile(null);
  };

  return {
    state: {
      productName,
      price,
      stock,
      description,
      imagePreview,
      imageFile,
    },
    setters: {
      setProductName,
      setPrice,
      setStock,
      setDescription,
    },
    handlers: {
      handleImageChange,
      handleAdd,
      handleDragOver,
      handleDrop,
      handleClearImage,
    },
  };
}
