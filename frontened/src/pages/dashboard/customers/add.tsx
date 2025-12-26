import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useAddCustomer } from "@/hooks/customers/useAddCustomer";

export default function AddCustomer() {
  const navigate = useNavigate();
  const { form, onSubmit, handleCancel, isLoading } = useAddCustomer();
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const countryValue = watch("address.country");

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Header section with Back, Title and Action Buttons */}
      <div className="mb-6 flex flex-col gap-1">
        <button
          onClick={() => navigate("/dashboard/customers")}
          className="flex items-center gap-1.5 text-[#7E84A3] hover:text-[#111827] transition-colors text-sm font-medium w-fit mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold text-[#111827]">Add Customer</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              className="h-11 px-6 border-[#E5E7EB] text-[#111827] font-medium rounded-lg shadow-none hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-customer-form"
              disabled={isLoading}
              className="h-11 px-8 bg-[#4EA674] hover:bg-[#3d8a5e] text-white font-medium rounded-lg shadow-sm"
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      <form
        id="add-customer-form"
        onSubmit={onSubmit}
        className="space-y-8 pb-20"
      >
        {/* Customer Information */}
        <Card className="border-[#E5E7EB] shadow-none rounded-xl">
          <CardHeader className="pt-8 px-8 pb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#111827]">
                Customer Information
              </h3>
              <p className="text-sm text-[#4EA674] font-medium">
                Most important information about the customer
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-[#4B5563]"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className={`h-11 border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674] ${
                    errors.firstName ? "border-destructive" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-[#4B5563]"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className={`h-11 border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674] ${
                    errors.lastName ? "border-destructive" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-[#4B5563]"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`h-11 border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674] ${
                    errors.email ? "border-destructive" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-[#4B5563]"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className={`h-11 border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674] ${
                    errors.phone ? "border-destructive" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Address */}
        <Card className="border-[#E5E7EB] shadow-none rounded-xl">
          <CardHeader className="pt-8 px-8 pb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#111827]">
                Customer Address
              </h3>
              <p className="text-sm text-[#7E84A3] font-medium">
                Shipping address information
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-[#4B5563]"
                >
                  Address
                </Label>
                <Input
                  id="address"
                  {...register("address.street")}
                  className={`h-11 border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674] ${
                    errors.address?.street ? "border-destructive" : ""
                  }`}
                />
                {errors.address?.street && (
                  <p className="text-xs text-destructive">
                    {errors.address.street.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="apartment"
                  className="text-sm font-medium text-[#4B5563]"
                >
                  Apartment
                </Label>
                <Input
                  id="apartment"
                  {...register("address.address2")}
                  className="h-11 border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="text-sm font-medium text-[#4B5563]"
                >
                  City
                </Label>
                <Input
                  id="city"
                  {...register("address.city")}
                  className={`h-11 border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674] ${
                    errors.address?.city ? "border-destructive" : ""
                  }`}
                />
                {errors.address?.city && (
                  <p className="text-xs text-destructive">
                    {errors.address.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium text-[#4B5563]"
                >
                  Country
                </Label>
                <Select
                  onValueChange={(val) => setValue("address.country", val)}
                  value={countryValue}
                >
                  <SelectTrigger
                    id="country"
                    className={`h-11 border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674] ${
                      errors.address?.country ? "border-destructive" : ""
                    }`}
                  >
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">
                      United Kingdom
                    </SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                  </SelectContent>
                </Select>
                {errors.address?.country && (
                  <p className="text-xs text-destructive">
                    {errors.address.country.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="postalCode"
                  className="text-sm font-medium text-[#4B5563]"
                >
                  Postal Code
                </Label>
                <Input
                  id="postalCode"
                  {...register("address.postalCode")}
                  className={`h-11 border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674] ${
                    errors.address?.postalCode ? "border-destructive" : ""
                  }`}
                />
                {errors.address?.postalCode && (
                  <p className="text-xs text-destructive">
                    {errors.address.postalCode.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div className="space-y-2">
                <Label
                  htmlFor="addressPhone"
                  className="text-sm font-medium text-[#4B5563]"
                >
                  Phone
                </Label>
                <Input
                  id="addressPhone"
                  type="tel"
                  {...register("address.phone")}
                  className={`h-11 border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674] ${
                    errors.address?.phone ? "border-destructive" : ""
                  }`}
                />
                {errors.address?.phone && (
                  <p className="text-xs text-destructive">
                    {errors.address.phone.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Notes */}
        <Card className="border-[#E5E7EB] shadow-none rounded-xl">
          <CardHeader className="pt-8 px-8 pb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#111827]">
                Customer Notes
              </h3>
              <p className="text-sm text-[#7E84A3] font-medium">
                Add notes about customer
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="text-sm font-medium text-[#4B5563]"
              >
                Notes
              </Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Add notes about customer"
                className="min-h-[140px] border-[#E5E7EB] focus:ring-[#4EA674] focus:border-[#4EA674] bg-[#F9FAFB] placeholder:text-[#9CA3AF]"
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
