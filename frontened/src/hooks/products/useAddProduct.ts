import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { productSchema, type ProductFormValues } from "@/schemas";
import {
  useAddProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "@/lib/store/services/products/productsApi";
import { toast } from "sonner";

export type { ProductFormValues };

export const useProductForm = (productId?: string) => {
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data: existingProduct, isLoading: isLoadingProduct } =
    useGetProductQuery(productId || "", {
      skip: !productId,
    });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      discountPrice: undefined,
      stockQuantity: undefined,
      isUnlimitedStock: false,
      isFeatured: false,
      colors: [],
      images: [],
      categoryId: "",
      tagId: "",
    },
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (existingProduct?.data) {
      const product = existingProduct.data;
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || undefined,
        stockQuantity: product.stockQuantity || undefined,
        isUnlimitedStock: product.isUnlimitedStock || false,
        isFeatured: product.isFeatured || false,
        categoryId:
          product.categoryId ||
          product.category?.id ||
          product.category?._id ||
          "",
        tagId: product.tags?.[0] || "",
        colors: product.colors || [],
        images: product.images || [],
        expirationStart: product.expirationStart
          ? new Date(product.expirationStart)
          : undefined,
        expirationEnd: product.expirationEnd
          ? new Date(product.expirationEnd)
          : undefined,
      });
      if (product.thumbnail) {
        setImagePreviews([product.thumbnail]);
      } else if (product.images?.length) {
        setImagePreviews(product.images);
      }
    }
  }, [existingProduct, form]);

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, ...files], {
        shouldValidate: true,
      });
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    const currentImages = form.getValues("images") || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue("images", newImages, { shouldValidate: true });
  };

  const toggleColor = (color: string) => {
    const currentColors = form.getValues("colors") || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    form.setValue("colors", newColors, { shouldValidate: true });
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "socialApp");
    formData.append("cloud_name", "deni18m0m");
    formData.append("folder", "socialApp");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/deni18m0m/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Handle image uploads
      const uploadedImages = await Promise.all(
        (data.images || []).map(async (image: string | File) => {
          if (image instanceof File) {
            return await uploadToCloudinary(image);
          }
          return image;
        })
      );

      const slug =
        data.name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();
      const sku = "SKU-" + Math.floor(Math.random() * 1000000);

      const productData = {
        ...data,
        expirationStart: data.expirationStart,
        expirationEnd: data.expirationEnd,
        images: uploadedImages,
        thumbnail: uploadedImages[0] || "",
        tags: data.tagId ? [data.tagId] : [],
        slug,
        sku,
        status: "ACTIVE" as const,
        lowStockThreshold: 10,
        // If unlimited stock is checked, we don't send stockQuantity or send 0
        stockQuantity: data.isUnlimitedStock ? 0 : data.stockQuantity,
      };

      if (productId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { slug: _s, sku: _k, ...updateData } = productData;
        await updateProduct({ id: productId, ...updateData }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await addProduct(productData).unwrap();
        toast.success("Product added successfully");
      }
      // Reset form with current values to clear isDirty state
      form.reset(form.getValues());
      // Removed navigate to keep user on page as requested
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while saving the product");
    }
  };

  const handleAction = () => {
    form.handleSubmit(onSubmit, (errors) => {
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const firstError = errors[errorKeys[0] as keyof typeof errors];
        toast.error(
          firstError?.message?.toString() || "Please check the form for errors"
        );
      }
    })();
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    handleAction,
    imagePreviews,
    onImageUpload,
    removeImage,
    toggleColor,
    isEditing: !!productId,
    isLoading: isLoadingProduct,
    isSaving: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
    productStatus: existingProduct?.data?.status,
  };
};
