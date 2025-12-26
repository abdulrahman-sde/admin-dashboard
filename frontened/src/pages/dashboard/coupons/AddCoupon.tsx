import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Ticket, Percent, Truck, Tag } from "lucide-react";
import { useAddCoupon } from "@/hooks/coupons/useAddCoupon";

const couponTypes = [
  {
    value: "FIXED",
    label: "Fixed Discount",
    icon: Ticket,
    description: "Fixed amount off",
  },
  {
    value: "PERCENTAGE",
    label: "Percentage Discount",
    icon: Percent,
    description: "Percentage off",
  },
  {
    value: "FREE_SHIPPING",
    label: "Free Shipping",
    icon: Truck,
    description: "Free shipping",
  },
  {
    value: "PRICE_DISCOUNT",
    label: "Price Discount",
    icon: Tag,
    description: "Price discount",
  },
];

export default function AddCoupon() {
  const navigate = useNavigate();
  const { form, onSubmit, isLoading } = useAddCoupon();

  const watchNoUsageLimit = form.watch("noUsageLimit");
  const watchType = form.watch("type");

  return (
    <div className="p-3 font-inter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 space-y-4">
        <h1 className="text-[24px] font-bold text-[#1a202c]">Create Coupon</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#48A878] text-[#48A878] hover:bg-[#48A878]/5 px-6 h-10 rounded-lg font-medium"
            onClick={() => navigate("/dashboard/coupons")}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-[#48A878] hover:bg-[#3d8e65] text-white px-8 h-10 rounded-lg font-medium"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Coupon Information Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-[16px] font-bold text-[#1a202c]">
                  Coupon Information
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Code will be used by users in checkout
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-600">
                        Coupon Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Shipfree20"
                          className="h-11 bg-[#F9FAFB] border border-gray-200 shadow-none focus:border-[#48A878] focus:ring-0 rounded-lg placeholder:text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-600">
                        Coupon Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Free Shipping"
                          className="h-11 bg-[#F9FAFB] border border-gray-200 shadow-none focus:border-[#48A878] focus:ring-0 rounded-lg placeholder:text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Coupon Type Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-[16px] font-bold text-[#1a202c]">
                  Coupon Type
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Type of coupon you want to create
                </p>
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {couponTypes.map((type) => {
                          const Icon = type.icon;
                          const isSelected = field.value === type.value;
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => field.onChange(type.value)}
                              className={cn(
                                "flex flex-col items-center justify-center p-8 rounded-lg border-2 transition-all duration-200",
                                isSelected
                                  ? "border-[#48A878] bg-white"
                                  : "border-gray-100 bg-white hover:border-gray-200"
                              )}
                            >
                              <div
                                className={cn(
                                  "mb-3",
                                  isSelected
                                    ? "text-[#48A878]"
                                    : "text-muted-foreground"
                                )}
                              >
                                <Icon className="h-6 w-6" />
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-medium text-center",
                                  isSelected
                                    ? "text-[#48A878]"
                                    : "text-gray-600"
                                )}
                              >
                                {type.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Discount Value & Applies To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">
                      Discount Value
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Amount"
                        className="h-11 bg-[#F9FAFB] border border-gray-200 shadow-none focus:border-[#48A878] focus:ring-0 rounded-lg placeholder:text-muted-foreground"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                        disabled={watchType === "FREE_SHIPPING"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appliesTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-600">
                      Applies to
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 bg-[#F9FAFB] border border-gray-200 shadow-none focus:border-[#48A878] focus:ring-0 rounded-lg text-gray-500">
                          <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">All Products</SelectItem>
                        <SelectItem value="SPECIFIC_PRODUCTS">
                          Specific Products
                        </SelectItem>
                        <SelectItem value="SPECIFIC_CATEGORIES">
                          Specific Categories
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duration & Usage Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-600">
                        Duration
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-11 justify-between text-left font-normal bg-[#F9FAFB] border border-gray-200 shadow-none focus:border-[#48A878] focus:ring-0 rounded-lg",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-muted-foreground">
                                  Set Duration
                                </span>
                              )}
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
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
                  name="noEndDate"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="rounded border-gray-300 data-[state=checked]:bg-[#48A878] data-[state=checked]:border-[#48A878]"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-gray-600 cursor-pointer">
                        Don't set duration
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-600">
                        Usage Limits
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Amount of uses"
                          className="h-11 bg-[#F9FAFB] border border-gray-200 shadow-none focus:border-[#48A878] focus:ring-0 rounded-lg placeholder:text-muted-foreground"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                          disabled={watchNoUsageLimit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="noUsageLimit"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="rounded border-gray-300 data-[state=checked]:bg-[#48A878] data-[state=checked]:border-[#48A878]"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-gray-600 cursor-pointer">
                        Don't limit amount of uses
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
