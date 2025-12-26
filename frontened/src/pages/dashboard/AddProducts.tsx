import { useProductForm } from "@/hooks/products/useAddProduct";
import { useCategory } from "@/hooks/useCategory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import { useRef } from "react";
import { useParams } from "react-router";

export default function AddProductsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    form,
    onSubmit,
    handleAction,
    imagePreviews,
    onImageUpload,
    removeImage,
    toggleColor,
    isEditing,
    isLoading,
    isDirty,
  } = useProductForm(id);

  const { data: categories } = useCategory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => fileInputRef.current?.click();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-2 space-y-8 ">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[#111827]">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                <Button
                  type="button"
                  onClick={() => handleAction()}
                  disabled={
                    form.formState.isSubmitting || (!isDirty && isEditing)
                  }
                  className="bg-[#4EA674] hover:bg-[#3d8a5e] text-white flex-1 sm:flex-none whitespace-nowrap"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Update Product" : "Publish Product"}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column - Product Information Card */}
            <div className="lg:col-span-8">
              <Card className="border-none shadow-sm">
                <CardContent className="p-6 pt-0 space-y-10">
                  {/* Basic Details Section */}
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-semibold text-[#111827]">
                      Basic Details
                    </h2>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="iPhone 15" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Description</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                placeholder="The iPhone 15 delivers cutting-edge performance..."
                                className="min-h-40 resize-y pr-8"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-[#111827]">
                      Pricing
                    </h3>
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="$999.89"
                              min="1"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="discountPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-600">
                              Discounted Price{" "}
                              <span className="text-gray-400 font-normal">
                                (Optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                  $
                                </div>
                                <Input
                                  type="number"
                                  placeholder="99"
                                  className="pl-7"
                                  min="1"
                                  {...field}
                                  value={field.value || ""}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                  Sale= $900.89
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="expirationStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-between text-left font-normal h-11 border-[#E5E7EB] bg-[#F9FAFB]",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Start Date</span>
                                    )}
                                    <CalendarIcon className="h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 border-[#E5E7EB]">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expirationEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-between text-left font-normal h-11 border-[#E5E7EB] bg-[#F9FAFB]",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>End Date</span>
                                    )}
                                    <CalendarIcon className="h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 border-[#E5E7EB]">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Inventory Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-[#111827]">
                      Inventory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="stockQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={
                                  form.watch("isUnlimitedStock")
                                    ? "Unlimited"
                                    : "0"
                                }
                                disabled={form.watch("isUnlimitedStock")}
                                min="0"
                                {...field}
                                value={
                                  form.watch("isUnlimitedStock")
                                    ? ""
                                    : field.value || ""
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="isUnlimitedStock"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer text-gray-600 mt-0">
                              Unlimited Stock
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="bg-green-500 border-green-500 text-white"
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-500">
                              Highlight this product in a featured section.
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <Button
                      type="button"
                      onClick={() => handleAction()}
                      disabled={
                        form.formState.isSubmitting || (!isDirty && isEditing)
                      }
                      className="bg-[#4EA674] hover:bg-[#3d8a5e] text-white"
                    >
                      {form.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isEditing ? "Update Product" : "Publish Product"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Media & Organizations Card */}
            <div className="lg:col-span-4">
              <Card className="border-none shadow-sm">
                <CardContent className="p-4 space-y-6 pt-0">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#111827]">
                      Upload Product Image
                    </h3>
                    <div>
                      <FormLabel className="text-[#4EA674] text-sm font-medium mb-2 block">
                        Product Image
                      </FormLabel>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={onImageUpload}
                        accept="image/*"
                      />

                      <div
                        onClick={triggerFileInput}
                        className="border border-dashed border-gray-300 rounded-lg p-3 bg-[#F9FAFB] text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="aspect-square relative flex flex-col items-center justify-center min-h-40">
                          {imagePreviews.length > 0 ? (
                            <img
                              src={imagePreviews[0]}
                              alt="Product Preview"
                              className="max-h-40 object-contain"
                            />
                          ) : (
                            <div className="text-gray-400">
                              <ImageIcon className="h-12 w-12 mx-auto opacity-20" />
                              <p className="text-xs mt-2">
                                Click to upload image
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {imagePreviews.map((preview, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square border border-gray-100 rounded-lg p-1 bg-white"
                        >
                          <img
                            src={preview}
                            alt={`Thumb ${idx}`}
                            className="w-full h-full object-contain rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(idx);
                            }}
                            className="absolute top-1 right-1 p-0.5 bg-white rounded-full shadow hover:bg-gray-100 border border-gray-100"
                          >
                            <X className="h-3 w-3 text-gray-500" />
                          </button>
                        </div>
                      ))}
                      <div
                        onClick={triggerFileInput}
                        className="aspect-square border border-dashed border-green-300 rounded-lg flex flex-col items-center justify-center text-green-600 hover:bg-green-50 cursor-pointer bg-[#F0FDF4]"
                      >
                        <div className="bg-green-100 p-1 rounded-full mb-1">
                          <Plus className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-[10px] font-medium">
                          Add Image
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Categories Section */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-[#111827]">
                      Categories
                    </h3>
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Categories</FormLabel>
                          <Select
                            key={field.value}
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.data?.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tagId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Tag</FormLabel>
                          <Select
                            key={field.value}
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Tag" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new">New Arrival</SelectItem>
                              <SelectItem value="sale">Best Seller</SelectItem>
                              <SelectItem value="featured">Featured</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel className="mb-2 block">
                        Select your color
                      </FormLabel>
                      <div className="flex flex-wrap gap-3">
                        {[
                          "#d9f99d",
                          "#fbcfe8",
                          "#cbd5e1",
                          "#fef3c7",
                          "#374151",
                        ].map((color) => {
                          const isSelected = (
                            form.watch("colors") || []
                          ).includes(color);
                          return (
                            <div
                              key={color}
                              onClick={() => toggleColor(color)}
                              className={cn(
                                "h-8 w-8 rounded-lg cursor-pointer shadow-sm transition-all border border-gray-100 flex items-center justify-center",
                                isSelected &&
                                  "ring-2 ring-offset-2 ring-[#4EA674]"
                              )}
                              style={{ backgroundColor: color }}
                            >
                              {isSelected && (
                                <div className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
