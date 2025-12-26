import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddProductDialog from "@/components/dashboard/categories/AddProductDialog";
import { MoreVertical, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { useAddCategory } from "@/hooks/categories/useAddCategory";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import QuickEditProductDialog from "@/components/dashboard/categories/QuickEditProductDialog";
import type { CategoryProduct } from "@/types/categories.types";

export default function EditCategory() {
  const { id } = useParams<{ id: string }>();

  // Use the comprehensive hook
  const {
    form,
    onSubmit,
    imagePreview,
    onImageUpload,
    isEditing,
    isLoading,
    products,
    handleQuickAddProduct,
    isAddingProduct,
    handleDeleteProduct,
    isDeletingProduct,
    handleUpdateProduct,
    isUpdatingProduct,
  } = useAddCategory(id);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    number | string | null
  >(null);
  const [productToEdit, setProductToEdit] = useState<CategoryProduct | null>(
    null
  );
  const [productToDelete, setProductToDelete] =
    useState<CategoryProduct | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section Skeleton (Products) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Section Skeleton (Category Info) */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 space-y-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-[#111827]">
              {isEditing ? "Edit Category" : "Create Category"}
            </h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                type="button"
                className="border-[#E5E7EB] text-[#374151]"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  (isEditing && !form.formState.isDirty)
                }
                className="bg-[#4EA674] hover:bg-[#3d8a5e] text-white"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Edit Category" : "Add Category"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section - Products List (Only visible in Edit Mode) */}
            <div className="lg:col-span-2 space-y-4">
              {isEditing ? (
                <div className="bg-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[#111827]">
                      Products in Category
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Render Products List */}
                    {products && products.length > 0 ? (
                      <div className="space-y-2">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                              selectedProduct === product.id
                                ? "border-[#4EA674] bg-[#4EA674]/5"
                                : "border-[#E5E7EB] hover:border-[#4EA674]/50"
                            }`}
                          >
                            <button
                              type="button"
                              className="text-[#6B7280] hover:text-[#111827]"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            <div className="h-12 w-12 rounded bg-[#F3F4F6] flex items-center justify-center overflow-hidden shrink-0">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl">👕</span>
                              )}
                            </div>
                            <span className="flex-1 text-sm text-[#111827]">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setProductToEdit(product);
                                  setShowEditDialog(true);
                                }}
                                className="p-1.5 hover:bg-[#F3F4F6] rounded transition-colors"
                              >
                                <Edit className="h-4 w-4 text-[#6B7280]" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setProductToDelete(product);
                                  setShowDeleteDialog(true);
                                }}
                                className="p-1.5 hover:bg-[#F3F4F6] rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4 text-[#6B7280]" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mb-4">
                        No products in this category yet.
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={() => setShowAddDialog(true)}
                      variant="outline"
                      className="w-full py-5.5 border-2 border-dashed border-[#E5E7EB] rounded-lg text-[#4EA674] hover:border-[#4EA674] hover:bg-[#4EA674]/5 transition-colors flex items-center justify-center gap-2 h-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Add Product to Category
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-blue-700">
                  Save the category first to manage products.
                </div>
              )}
            </div>

            {/* Right Section - Category Details */}
            <div className="space-y-6">
              {/* Category Visibility */}
              <div className="bg-white rounded-lg p-6 space-y-4 ">
                <h3 className="font-semibold text-[#111827]">
                  Category Visibility
                </h3>
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg p-4 bg-white">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm text-[#374151]">
                          Visible on site
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Category Info */}
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h3 className="font-semibold text-[#111827]">Category Info</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#4B5563]">
                        Category Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Women Clothes"
                          {...field}
                          className="border-[#E5E7EB] focus:border-[#4EA674] focus:ring-[#4EA674]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <Label className="text-sm text-[#4B5563]">Image</Label>
                  <label className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-8 text-center hover:border-[#4EA674] transition-colors cursor-pointer relative h-48 flex items-center justify-center overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageUpload}
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Category"
                          className="h-full w-full object-contain mx-auto rounded"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                          <span className="text-white text-xs font-medium">
                            Click to Change
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-[#4EA674] font-medium border border-[#4EA674]/20 px-4 py-2 rounded-md bg-[#4EA674]/5 hover:bg-[#4EA674]/10 transition-colors">
                          Add File
                        </span>
                        <p className="text-sm text-[#6B7280] mt-4">
                          Or drag and drop files
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>

      {/* Add Product Dialog */}
      <AddProductDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={handleQuickAddProduct}
        isLoading={isAddingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={async () => {
          if (productToDelete) {
            await handleDeleteProduct(productToDelete.id);
          }
        }}
        title="Delete Product"
        description={`Are you sure you want to remove "${productToDelete?.name}"? This action cannot be undone.`}
        isLoading={isDeletingProduct}
      />

      {/* Quick Edit Dialog */}
      <QuickEditProductDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        product={productToEdit}
        onSave={handleUpdateProduct}
        isLoading={isUpdatingProduct}
      />
    </div>
  );
}
