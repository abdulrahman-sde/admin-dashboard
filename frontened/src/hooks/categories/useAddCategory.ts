import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { categorySchema, type CategoryFormValues } from "@/schemas";
import {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/lib/store/services/categories/categoryApi";
import {
  useAddProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/lib/store/services/products/productsApi";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import type { CategoryProduct } from "@/types/categories.types";
import type { QuickAddProductInput } from "@/types/categories.types";

export const useAddCategory = (categoryId?: string) => {
  const navigate = useNavigate();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [addProduct, { isLoading: isAddingProduct }] = useAddProductMutation();
  const [deleteProduct, { isLoading: isDeletingProduct }] =
    useDeleteProductMutation();
  const [updateProduct, { isLoading: isUpdatingProduct }] =
    useUpdateProductMutation();

  const { data: existingCategory, isLoading: isLoadingCategory } =
    useGetCategoryQuery(categoryId || "", {
      skip: !categoryId,
    });

  // Fetch products associated with this category using the products API
  const { data: categoryProductsData } = useGetProductsQuery(
    {
      categoryId: categoryId || "",
      limit: 100, // Fetch a reasonable number of products for the edit view
    },
    {
      skip: !categoryId,
    }
  );

  // Extract products from the separate products query
  const products: CategoryProduct[] = categoryProductsData?.data
    ? categoryProductsData.data.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.images?.[0] || p.thumbnail || "",
        price: p.price,
        stock: p.stockQuantity,
      }))
    : [];

  const categoryData = existingCategory?.data || null;

  const form = useForm<CategoryFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      image: "",
      visibility: true,
    },
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (categoryData) {
      form.reset({
        name: categoryData.name,
        image: categoryData.image || "",
        visibility: categoryData.visibility ?? true,
      });
      if (categoryData.image) {
        setImagePreview(categoryData.image);
      }
    }
  }, [categoryData, form]);

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      form.setValue("image", file, { shouldDirty: true });
    }
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
        const errorData = await response.json();
        console.error("Cloudinary error response:", errorData);
        throw new Error(errorData.error?.message || "Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      let imageUrl = data.image;
      if (data.image instanceof File) {
        imageUrl = await uploadToCloudinary(data.image);
      }

      const slug =
        data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") +
        "-" +
        Date.now();

      const payload = {
        name: data.name,
        image: imageUrl,
        visibility: data.visibility,
        slug,
      };

      if (categoryId) {
        await updateCategory({ id: categoryId, ...payload }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created successfully");
      }
      navigate("/dashboard/categories");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  const handleQuickAddProduct = async (productData: QuickAddProductInput) => {
    if (!categoryId) {
      toast.error("Please save the category first before adding products.");
      return;
    }

    try {
      let imageUrl = "";
      if (productData.image) {
        imageUrl = await uploadToCloudinary(productData.image);
      }

      const slug =
        productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") +
        "-" +
        Date.now();
      const sku = "SKU-" + Math.floor(Math.random() * 1000000);

      await addProduct({
        name: productData.name,
        price: productData.price,
        stockQuantity: productData.stock,
        description:
          productData.description || "Quick added product description",
        categoryId: categoryId,
        slug,
        sku,
        status: "DRAFT",
        isUnlimitedStock: false,
        lowStockThreshold: 10,
        images: imageUrl ? [imageUrl] : [],
        thumbnail: imageUrl || "",
        tags: [],
        colors: [],
      }).unwrap();
      toast.success("Product added to category!");
    } catch (error: unknown) {
      console.error("Failed to add product:", error);
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to add product");
      throw error; // Rethrow to let dialog handle it
    }
  };

  const handleDeleteProduct = async (productId: string | number) => {
    try {
      await deleteProduct(productId.toString()).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleUpdateProduct = async (
    productId: string | number,
    data: { name: string; price?: number; stock?: number }
  ) => {
    try {
      // Convert stock to stockQuantity for the API
      const { stock, ...rest } = data;
      const apiPayload = {
        ...rest,
        ...(stock !== undefined ? { stockQuantity: stock } : {}),
      };

      await updateProduct({ id: productId.toString(), ...apiPayload }).unwrap();
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product");
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    imagePreview,
    onImageUpload,
    isEditing: !!categoryId,
    isLoading: isCreating || isLoadingCategory || isUpdating,
    products,
    handleQuickAddProduct,
    isAddingProduct,
    handleDeleteProduct,
    isDeletingProduct,
    handleUpdateProduct,
    isUpdatingProduct,
  };
};
